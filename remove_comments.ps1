# Script to remove XML documentation comments and regular comments from C# files
# Excludes auto-generated files and obj/bin directories

$rootPath = "c:\TaskTracker\TaskTracker\TaskTrackerAPI"

# Find all C# files excluding auto-generated ones
$csFiles = Get-ChildItem -Path $rootPath -Recurse -Filter "*.cs" | 
    Where-Object { 
        $_.FullName -notmatch "\\obj\\" -and 
        $_.FullName -notmatch "\\bin\\" -and
        $_.FullName -notmatch "Migrations" -and
        $_.Name -notmatch "\.Designer\.cs$" -and
        $_.Name -notmatch "\.g\.cs$" -and
        $_.Name -notmatch "AssemblyInfo\.cs$" -and
        $_.Name -notmatch "AssemblyAttributes\.cs$" -and
        $_.Name -notmatch "GlobalUsings\.g\.cs$"
    }

foreach ($file in $csFiles) {
    Write-Host "Processing: $($file.FullName)"
    
    try {
        # Read all lines
        $lines = Get-Content $file.FullName
        $newLines = @()
        
        foreach ($line in $lines) {
            # Skip XML documentation comments (///)
            if ($line -match '^\s*///') {
                continue
            }
            
            # Skip regular single-line comments (// but keep URLs and special cases)
            if ($line -match '^\s*//\s' -and $line -notmatch 'http' -and $line -notmatch 'TODO' -and $line -notmatch 'HACK' -and $line -notmatch 'FIXME') {
                continue
            }
            
            # Keep the line
            $newLines += $line
        }
        
        # Write back to file
        $newLines | Set-Content $file.FullName -Encoding UTF8
        Write-Host "Processed: $($file.Name)"
        
    } catch {
        Write-Host "Error processing $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Comment removal completed!"
