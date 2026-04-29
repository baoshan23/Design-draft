package store

import (
	"context"
	"errors"
	"fmt"
	"strings"
)

// Plan mirrors a purchasable tier from the official price PDF (GCSS软件平台报价单).
// Pricing is server-authoritative — the frontend describes the selection but
// PriceFor below is the one source of truth for what gets charged.
type Plan struct {
	ID                   int64  `json:"id"`
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
	IsActive             bool   `json:"isActive"`
	SortOrder            int    `json:"sortOrder"`
}

// Addon is a separately priced option that can layer onto any plan.
type Addon struct {
	ID         int64  `json:"id"`
	Key        string `json:"key"`
	LabelEN    string `json:"labelEn"`
	LabelZH    string `json:"labelZh"`
	PriceCents int64  `json:"priceCents"`
	PriceModel string `json:"priceModel"` // "per_unit" | "per_day"
	UnitNoteEN string `json:"unitNoteEn"`
	UnitNoteZH string `json:"unitNoteZh"`
	IsActive   bool   `json:"isActive"`
	SortOrder  int    `json:"sortOrder"`
}

// defaultPlans / defaultAddons are seeded into the DB once on first boot if
// the tables are empty. After seeding, edits go through the admin panel.
func defaultPlans() []Plan {
	return []Plan{
		{
			Key: "saas", LabelEN: "SaaS Hosted", LabelZH: "SaaS 托管",
			DescriptionEN: "Shared SaaS server (Hong Kong). $84 per charger per year, annual billing.",
			DescriptionZH: "共享 SaaS 服务器（香港节点）。按桩计费 $84/年/桩，年度结算。",
			Family:         "hosted",
			RecurringCents: 8400,
			RecurringUnit:  "year_per_charger",
			HasYearly:      true,
			IsActive:       true,
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
			IsActive:          true,
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
			IsActive:             true,
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
			IsActive:             true,
			SortOrder:            4,
		},
		{
			Key: "appplat", LabelEN: "APP Platform", LabelZH: "APP 平台版",
			DescriptionEN: "B2B2C multi-operator native app platform with full CPO console. Optional $1,200/year hosting.",
			DescriptionZH: "B2B2C 多运营商原生 APP 平台版，含完整 CPO 控制台。可选 $1,200/年 服务器托管。",
			Family:               "private",
			BasePriceCents:       6800000,
			OptionalHostingCents: 120000,
			UnlimitedChargers:    true,
			IsActive:             true,
			SortOrder:            5,
		},
	}
}

func defaultAddons() []Addon {
	return []Addon{
		{Key: "mobile_lang", LabelEN: "Extra mobile-app language", LabelZH: "移动端额外语言", PriceCents: 10000, PriceModel: "per_unit", UnitNoteEN: "per language", UnitNoteZH: "每种", IsActive: true, SortOrder: 1},
		{Key: "admin_lang", LabelEN: "Extra admin-panel language", LabelZH: "后台额外语言", PriceCents: 10000, PriceModel: "per_unit", UnitNoteEN: "per language", UnitNoteZH: "每种", IsActive: true, SortOrder: 2},
		{Key: "gateway", LabelEN: "Extra payment gateway", LabelZH: "额外支付网关", PriceCents: 100000, PriceModel: "per_unit", UnitNoteEN: "per gateway", UnitNoteZH: "每种", IsActive: true, SortOrder: 3},
		{Key: "pos", LabelEN: "POS integration", LabelZH: "POS 集成", PriceCents: 100000, PriceModel: "per_unit", UnitNoteEN: "per POS type", UnitNoteZH: "每种", IsActive: true, SortOrder: 4},
		{Key: "customization", LabelEN: "Custom development", LabelZH: "定制开发", PriceCents: 12000, PriceModel: "per_day", UnitNoteEN: "per person-day", UnitNoteZH: "每人日", IsActive: true, SortOrder: 5},
	}
}

// SeedPlansIfEmpty inserts the default catalog rows on first boot.
func (s *Store) SeedPlansIfEmpty(ctx context.Context) error {
	var planCount, addonCount int
	if err := s.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM plans`).Scan(&planCount); err != nil {
		return err
	}
	if err := s.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM addons`).Scan(&addonCount); err != nil {
		return err
	}
	if planCount == 0 {
		for _, p := range defaultPlans() {
			if _, err := s.UpsertPlan(ctx, p); err != nil {
				return fmt.Errorf("seed plan %s: %w", p.Key, err)
			}
		}
	}
	if addonCount == 0 {
		for _, a := range defaultAddons() {
			if _, err := s.UpsertAddon(ctx, a); err != nil {
				return fmt.Errorf("seed addon %s: %w", a.Key, err)
			}
		}
	}
	return nil
}

// ── Plan reads/writes ────────────────────────────────────────────────

func (s *Store) ListPlans(ctx context.Context, activeOnly bool) ([]Plan, error) {
	q := `SELECT id, key, label_en, label_zh, description_en, description_zh, family, base_price_cents, recurring_cents, recurring_unit, yearly_cents, optional_hosting_cents, has_monthly, has_yearly, unlimited_chargers, is_active, sort_order FROM plans`
	if activeOnly {
		q += ` WHERE is_active = 1`
	}
	q += ` ORDER BY sort_order ASC, id ASC;`
	rows, err := s.db.QueryContext(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []Plan
	for rows.Next() {
		var p Plan
		var hasMonthly, hasYearly, unlimited, active int
		if err := rows.Scan(&p.ID, &p.Key, &p.LabelEN, &p.LabelZH, &p.DescriptionEN, &p.DescriptionZH, &p.Family, &p.BasePriceCents, &p.RecurringCents, &p.RecurringUnit, &p.YearlyCents, &p.OptionalHostingCents, &hasMonthly, &hasYearly, &unlimited, &active, &p.SortOrder); err != nil {
			return nil, err
		}
		p.HasMonthly = hasMonthly == 1
		p.HasYearly = hasYearly == 1
		p.UnlimitedChargers = unlimited == 1
		p.IsActive = active == 1
		out = append(out, p)
	}
	return out, rows.Err()
}

func (s *Store) UpsertPlan(ctx context.Context, p Plan) (Plan, error) {
	p.Key = strings.TrimSpace(p.Key)
	p.LabelEN = strings.TrimSpace(p.LabelEN)
	p.LabelZH = strings.TrimSpace(p.LabelZH)
	if p.Key == "" || p.LabelEN == "" {
		return p, errors.New("key and labelEn are required")
	}
	if p.Family == "" {
		p.Family = "private"
	}
	hm := boolToInt(p.HasMonthly)
	hy := boolToInt(p.HasYearly)
	un := boolToInt(p.UnlimitedChargers)
	ac := boolToInt(p.IsActive)
	if p.ID > 0 {
		_, err := s.db.ExecContext(ctx, `UPDATE plans SET key=?, label_en=?, label_zh=?, description_en=?, description_zh=?, family=?, base_price_cents=?, recurring_cents=?, recurring_unit=?, yearly_cents=?, optional_hosting_cents=?, has_monthly=?, has_yearly=?, unlimited_chargers=?, is_active=?, sort_order=? WHERE id=?;`,
			p.Key, p.LabelEN, p.LabelZH, p.DescriptionEN, p.DescriptionZH, p.Family, p.BasePriceCents, p.RecurringCents, p.RecurringUnit, p.YearlyCents, p.OptionalHostingCents, hm, hy, un, ac, p.SortOrder, p.ID)
		return p, err
	}
	res, err := s.db.ExecContext(ctx, `INSERT INTO plans (key, label_en, label_zh, description_en, description_zh, family, base_price_cents, recurring_cents, recurring_unit, yearly_cents, optional_hosting_cents, has_monthly, has_yearly, unlimited_chargers, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
		p.Key, p.LabelEN, p.LabelZH, p.DescriptionEN, p.DescriptionZH, p.Family, p.BasePriceCents, p.RecurringCents, p.RecurringUnit, p.YearlyCents, p.OptionalHostingCents, hm, hy, un, ac, p.SortOrder)
	if err != nil {
		return p, err
	}
	p.ID, _ = res.LastInsertId()
	return p, nil
}

func (s *Store) DeletePlan(ctx context.Context, id int64) error {
	if id <= 0 {
		return errors.New("invalid id")
	}
	_, err := s.db.ExecContext(ctx, `DELETE FROM plans WHERE id = ?;`, id)
	return err
}

// ── Addon reads/writes ───────────────────────────────────────────────

func (s *Store) ListAddons(ctx context.Context, activeOnly bool) ([]Addon, error) {
	q := `SELECT id, key, label_en, label_zh, price_cents, price_model, unit_note_en, unit_note_zh, is_active, sort_order FROM addons`
	if activeOnly {
		q += ` WHERE is_active = 1`
	}
	q += ` ORDER BY sort_order ASC, id ASC;`
	rows, err := s.db.QueryContext(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []Addon
	for rows.Next() {
		var a Addon
		var active int
		if err := rows.Scan(&a.ID, &a.Key, &a.LabelEN, &a.LabelZH, &a.PriceCents, &a.PriceModel, &a.UnitNoteEN, &a.UnitNoteZH, &active, &a.SortOrder); err != nil {
			return nil, err
		}
		a.IsActive = active == 1
		out = append(out, a)
	}
	return out, rows.Err()
}

func (s *Store) UpsertAddon(ctx context.Context, a Addon) (Addon, error) {
	a.Key = strings.TrimSpace(a.Key)
	a.LabelEN = strings.TrimSpace(a.LabelEN)
	if a.Key == "" || a.LabelEN == "" {
		return a, errors.New("key and labelEn are required")
	}
	if a.PriceModel == "" {
		a.PriceModel = "per_unit"
	}
	ac := boolToInt(a.IsActive)
	if a.ID > 0 {
		_, err := s.db.ExecContext(ctx, `UPDATE addons SET key=?, label_en=?, label_zh=?, price_cents=?, price_model=?, unit_note_en=?, unit_note_zh=?, is_active=?, sort_order=? WHERE id=?;`,
			a.Key, a.LabelEN, a.LabelZH, a.PriceCents, a.PriceModel, a.UnitNoteEN, a.UnitNoteZH, ac, a.SortOrder, a.ID)
		return a, err
	}
	res, err := s.db.ExecContext(ctx, `INSERT INTO addons (key, label_en, label_zh, price_cents, price_model, unit_note_en, unit_note_zh, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
		a.Key, a.LabelEN, a.LabelZH, a.PriceCents, a.PriceModel, a.UnitNoteEN, a.UnitNoteZH, ac, a.SortOrder)
	if err != nil {
		return a, err
	}
	a.ID, _ = res.LastInsertId()
	return a, nil
}

func (s *Store) DeleteAddon(ctx context.Context, id int64) error {
	if id <= 0 {
		return errors.New("invalid id")
	}
	_, err := s.db.ExecContext(ctx, `DELETE FROM addons WHERE id = ?;`, id)
	return err
}

// PlanCatalog loads active plans + addons from the DB.
func (s *Store) PlanCatalog(ctx context.Context) ([]Plan, []Addon, error) {
	plans, err := s.ListPlans(ctx, true)
	if err != nil {
		return nil, nil, err
	}
	addons, err := s.ListAddons(ctx, true)
	if err != nil {
		return nil, nil, err
	}
	return plans, addons, nil
}

func boolToInt(b bool) int {
	if b {
		return 1
	}
	return 0
}

// PlanSelection is the validated input shape used to compute the price.
type PlanSelection struct {
	PlanKey     string
	BillingMode string // "monthly" | "yearly" | "one_time"
	Years       int    // 1..6 — used by yearly billing and hosting term
	Months      int    // 1..12 — used by customweb monthly billing (overrides years*12 when > 0)
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
// Pricing logic still keys off well-known plan keys (saas / customweb /
// appent / webplat / appplat); admin can edit prices but adding entirely new
// keys requires a code change to handle their formula.
func PriceFor(sel PlanSelection, plans []Plan, addons []Addon) (int64, string, error) {
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
	if years > 6 {
		years = 6
	}
	months := sel.Months
	if months < 1 {
		months = 0
	}
	if months > 12 {
		months = 12
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
		default:
			effectiveMonths := months
			if effectiveMonths == 0 {
				effectiveMonths = years * 12
			}
			subtotal = base + plan.RecurringCents*int64(effectiveMonths)
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
			effectiveMonths := months
			if effectiveMonths == 0 {
				effectiveMonths = years * 12
			}
			label = fmt.Sprintf("%s + %d months", plan.LabelEN, effectiveMonths)
		}
	case "appent", "webplat", "appplat":
		if sel.WithHosting {
			label = fmt.Sprintf("%s + %dy hosting", plan.LabelEN, years)
		}
	}
	return subtotal, label, nil
}

