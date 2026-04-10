$docPath = 'c:\Users\vipar\OneDrive\Desktop\GCSS\Gcss_website\Design\官网修改.docx'
$pdfPath = 'c:\Users\vipar\OneDrive\Desktop\GCSS\Gcss_website\Design\官网修改.pdf'

try {
  $Word = New-Object -ComObject Word.Application
  $Word.Visible = $false
  $doc = $Word.Documents.Open($docPath)
  $doc.SaveAs([ref]$pdfPath, [ref]17)
  $doc.Close()
  $Word.Quit()
  Write-Host "PDF created successfully: $pdfPath"
} catch {
  Write-Host "Error: $($_.Exception.Message)"
  exit 1
}
