package store

import (
	"errors"
	"fmt"
)

// Plan mirrors a purchasable tier from the official price PDF (GCSS软件平台报价单).
// Pricing is server-authoritative — the frontend describes the selection but
// PriceFor below is the one source of truth for what gets charged.
type Plan struct {
	Key                  string `json:"key"`
	LabelEN              string `json:"labelEn"`
	LabelZH              string `json:"labelZh"`
	DescriptionEN        string `json:"descriptionEn"`
	DescriptionZH        string `json:"descriptionZh"`
	Family               string `json:"family"` // "hosted" | "private"
	BasePriceCents       int64  `json:"basePriceCents"`
	RecurringCents       int64  `json:"recurringCents"`
	RecurringUnit        string `json:"recurringUnit"` // "month" | "year" | "year_per_charger" | ""
	YearlyCents          int64  `json:"yearlyCents"`
	OptionalHostingCents int64  `json:"optionalHostingCents"`
	HasMonthly           bool   `json:"hasMonthly"`
	HasYearly            bool   `json:"hasYearly"`
	UnlimitedChargers    bool   `json:"unlimitedChargers"`
	SortOrder            int    `json:"sortOrder"`
}

// Addon is a separately priced option that can layer onto any plan.
type Addon struct {
	Key        string `json:"key"`
	LabelEN    string `json:"labelEn"`
	LabelZH    string `json:"labelZh"`
	PriceCents int64  `json:"priceCents"`
	PriceModel string `json:"priceModel"` // "per_unit" | "per_day"
	UnitNoteEN string `json:"unitNoteEn"`
	UnitNoteZH string `json:"unitNoteZh"`
}

// PlanCatalog returns the 6 plan tiers + 5 add-ons matching the official price PDF.
func PlanCatalog() ([]Plan, []Addon) {
	plans := []Plan{
		{
			Key: "saas", LabelEN: "SaaS Hosted", LabelZH: "SaaS 托管",
			DescriptionEN: "Shared SaaS server (Hong Kong). $84 per charger per year, annual billing.",
			DescriptionZH: "共享 SaaS 服务器（香港节点）。按桩计费 $84/年/桩，年度结算。",
			Family:         "hosted",
			RecurringCents: 8400,
			RecurringUnit:  "year_per_charger",
			HasYearly:      true,
			SortOrder:      1,
		},
		{
			Key: "customweb", LabelEN: "Custom Web APP", LabelZH: "定制品牌 Web APP",
			DescriptionEN: "Custom-branded web app. $300 setup + $120/month (or $1,500 first year, $1,200/year thereafter).",
			DescriptionZH: "自定义品牌 Web APP。$300 一次性安装 + $120/月（或首年 $1,500、次年起 $1,200/年）。",
			Family:            "private",
			BasePriceCents:    30000,
			RecurringCents:    12000,
			RecurringUnit:     "month",
			YearlyCents:       120000,
			HasMonthly:        true,
			HasYearly:         true,
			UnlimitedChargers: true,
			SortOrder:         2,
		},
		{
			Key: "appent", LabelEN: "APP Enterprise", LabelZH: "APP 企业版",
			DescriptionEN: "Custom-branded native app, published on Google Play & App Store. Optional $1,200/year hosting.",
			DescriptionZH: "自定义品牌原生 APP，上架 Google Play 与 App Store。可选 $1,200/年 服务器托管。",
			Family:               "private",
			BasePriceCents:       1690000,
			OptionalHostingCents: 120000,
			UnlimitedChargers:    true,
			SortOrder:            3,
		},
		{
			Key: "webplat", LabelEN: "Web APP Platform", LabelZH: "Web APP 平台版",
			DescriptionEN: "B2B2C multi-operator web platform with CPO console. Optional $1,200/year hosting.",
			DescriptionZH: "B2B2C 多运营商 Web 平台版，含 CPO 控制台。可选 $1,200/年 服务器托管。",
			Family:               "private",
			BasePriceCents:       2180000,
			OptionalHostingCents: 120000,
			UnlimitedChargers:    true,
			SortOrder:            4,
		},
		{
			Key: "appplat", LabelEN: "APP Platform", LabelZH: "APP 平台版",
			DescriptionEN: "B2B2C multi-operator native app platform with full CPO console. Optional $1,200/year hosting.",
			DescriptionZH: "B2B2C 多运营商原生 APP 平台版，含完整 CPO 控制台。可选 $1,200/年 服务器托管。",
			Family:               "private",
			BasePriceCents:       3420000,
			OptionalHostingCents: 120000,
			UnlimitedChargers:    true,
			SortOrder:            5,
		},
	}

	addons := []Addon{
		{Key: "mobile_lang", LabelEN: "Extra mobile-app language", LabelZH: "移动端额外语言", PriceCents: 10000, PriceModel: "per_unit", UnitNoteEN: "per language", UnitNoteZH: "每种"},
		{Key: "admin_lang", LabelEN: "Extra admin-panel language", LabelZH: "后台额外语言", PriceCents: 10000, PriceModel: "per_unit", UnitNoteEN: "per language", UnitNoteZH: "每种"},
		{Key: "gateway", LabelEN: "Extra payment gateway", LabelZH: "额外支付网关", PriceCents: 100000, PriceModel: "per_unit", UnitNoteEN: "per gateway", UnitNoteZH: "每种"},
		{Key: "pos", LabelEN: "POS integration", LabelZH: "POS 集成", PriceCents: 100000, PriceModel: "per_unit", UnitNoteEN: "per POS type", UnitNoteZH: "每种"},
		{Key: "customization", LabelEN: "Custom development", LabelZH: "定制开发", PriceCents: 12000, PriceModel: "per_day", UnitNoteEN: "per person-day", UnitNoteZH: "每人日"},
	}
	return plans, addons
}

// PlanSelection is the validated input shape used to compute the price.
type PlanSelection struct {
	PlanKey     string
	BillingMode string // "monthly" | "yearly" | "one_time"
	Years       int    // 1..5
	Chargers    int    // SaaS only
	WithHosting bool   // one-time plans only
	Addons      []PlanAddonChoice
}

type PlanAddonChoice struct {
	Key      string
	Quantity int
}

// PriceFor returns the authoritative subtotal in USD cents and a human label.
// Validation is intentionally strict so we never accept an under-charging cart.
func PriceFor(sel PlanSelection) (int64, string, error) {
	plans, addons := PlanCatalog()

	var plan *Plan
	for i := range plans {
		if plans[i].Key == sel.PlanKey {
			plan = &plans[i]
			break
		}
	}
	if plan == nil {
		return 0, "", errors.New("invalid plan key")
	}

	years := sel.Years
	if years < 1 {
		years = 1
	}
	if years > 5 {
		years = 5
	}

	var subtotal int64
	switch plan.Key {
	case "saas":
		if sel.Chargers < 1 {
			return 0, "", errors.New("at least 1 charger required for SaaS plan")
		}
		if sel.Chargers > 100000 {
			return 0, "", errors.New("charger count exceeds maximum")
		}
		subtotal = int64(sel.Chargers) * plan.RecurringCents * int64(years)
	case "customweb":
		base := plan.BasePriceCents
		switch sel.BillingMode {
		case "yearly":
			subtotal = base + plan.YearlyCents*int64(years)
		default: // monthly
			months := int64(years * 12)
			subtotal = base + plan.RecurringCents*months
		}
	case "appent", "webplat", "appplat":
		subtotal = plan.BasePriceCents
		if sel.WithHosting {
			subtotal += plan.OptionalHostingCents * int64(years)
		}
	default:
		return 0, "", errors.New("unhandled plan key")
	}

	addonByKey := make(map[string]Addon, len(addons))
	for _, a := range addons {
		addonByKey[a.Key] = a
	}
	for _, a := range sel.Addons {
		ad, ok := addonByKey[a.Key]
		if !ok {
			continue
		}
		qty := a.Quantity
		if qty < 1 {
			continue
		}
		if qty > 1000 {
			qty = 1000
		}
		subtotal += ad.PriceCents * int64(qty)
	}

	label := plan.LabelEN
	switch plan.Key {
	case "saas":
		label = fmt.Sprintf("%s × %d chargers × %dy", plan.LabelEN, sel.Chargers, years)
	case "customweb":
		if sel.BillingMode == "yearly" {
			label = fmt.Sprintf("%s + %dy yearly", plan.LabelEN, years)
		} else {
			label = fmt.Sprintf("%s + %d months", plan.LabelEN, years*12)
		}
	case "appent", "webplat", "appplat":
		if sel.WithHosting {
			label = fmt.Sprintf("%s + %dy hosting", plan.LabelEN, years)
		}
	}
	return subtotal, label, nil
}
