function Start-TerminalExplorer {
    $history = @()
    $historyIndex = -1
    $currentDir = Get-Location
    $selectionIndex = 0
    $visibleStart = 0
    $visibleCount = 50

    function Push-History($dir) {
        if ($historyIndex -lt ($history.Count - 1)) {
            $history = $history[0..$historyIndex]
        }
        $history += $dir
        $historyIndex++
    }

    function Get-SafeItems($path) {
        try {
            return Get-ChildItem -Path $path -ErrorAction Stop | Sort-Object { $_.PSIsContainer -eq $false }, Name
        } catch {
            Write-Warning "⚠️ Cannot access: $path. Returning to home directory."
            Set-Location $env:USERPROFILE
            $currentDir = Get-Location
            Push-History $currentDir
            return @()
        }
    }

    Push-History $currentDir

    while ($true) {
        Clear-Host
        Write-Host "📁 Terminal File Explorer" -ForegroundColor Cyan
        Write-Host "Current Directory: $($currentDir.Path)`n" -ForegroundColor Yellow

        $items = Get-SafeItems $currentDir
        if (-not $items -or $items.Count -eq 0) {
            Write-Host "(Empty or inaccessible directory)" -ForegroundColor DarkGray
        }

        $visibleItems = $items[$visibleStart..[Math]::Min($visibleStart + $visibleCount - 1, [Math]::Max(0, $items.Count - 1))]

        for ($i = 0; $i -lt $visibleItems.Count; $i++) {
            $actualIndex = $visibleStart + $i
            $isDir = if ($visibleItems[$i].PSIsContainer) { "[DIR]" } else { "     " }
            if ($actualIndex -eq $selectionIndex) {
                Write-Host (" > {0} {1}" -f $isDir, $visibleItems[$i].Name) -BackgroundColor DarkCyan -ForegroundColor White
            } else {
                Write-Host ("   {0} {1}" -f $isDir, $visibleItems[$i].Name)
            }
        }

        Write-Host "`n↑/↓ scroll | ← cd .. | → forward | Enter open/view | Esc quit | 1 exit file view"

        $key = [System.Console]::ReadKey($true)

        switch ($key.Key) {
            'UpArrow' {
                if ($selectionIndex -gt 0) {
                    $selectionIndex--
                    if ($selectionIndex -lt $visibleStart) {
                        $visibleStart = [Math]::Max(0, $visibleStart - 1)
                    }
                }
            }
            'DownArrow' {
                if ($selectionIndex -lt ($items.Count - 1)) {
                    $selectionIndex++
                    if ($selectionIndex -ge $visibleStart + $visibleCount) {
                        $visibleStart++
                    }
                }
            }
            'LeftArrow' {
                Set-Location ..
                $currentDir = Get-Location
                Push-History $currentDir
                $selectionIndex = 0
                $visibleStart = 0
            }
            'RightArrow' {
                $selected = $items[$selectionIndex]
                if ($selected.PSIsContainer) {
                    $currentDir = Set-Location $selected.FullName; Get-Location
                    Push-History $currentDir
                    $selectionIndex = 0; $visibleStart = 0
                } else {
                    Clear-Host
                    Write-Host "📄 Viewing: $($selected.FullName)" -ForegroundColor Cyan
                    cat $selected.FullName
                    Write-Host "Press Enter to continue..."
                    [void][System.Console]::ReadLine()
                }
            }
            'Enter' {
                $selected = $items[$selectionIndex]
                if ($selected.PSIsContainer) {
                    $currentDir = Set-Location $selected.FullName; Get-Location
                    Push-History $currentDir
                    $selectionIndex = 0; $visibleStart = 0
                } else {
                    Clear-Host
                    Write-Host "📄 Viewing: $($selected.FullName)" -ForegroundColor Cyan
                    cat $selected.FullName
                    Write-Host "Press Enter to continue..."
                    [void][System.Console]::ReadLine()
                }
            }
            'Escape' { break }
        }
    }
}

Start-TerminalExplorer
