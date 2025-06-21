Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Create main form
$form = New-Object System.Windows.Forms.Form
$form.Text = "File Explorer GUI"
$form.Size = New-Object System.Drawing.Size(800, 650)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = 'Sizable'
$form.MinimumSize = New-Object System.Drawing.Size(650, 500)

# Current directory label
$labelCurrentDir = New-Object System.Windows.Forms.Label
$labelCurrentDir.Location = New-Object System.Drawing.Point(10,10)
$labelCurrentDir.Size = New-Object System.Drawing.Size(760,20)
$labelCurrentDir.Font = New-Object System.Drawing.Font("Segoe UI",10,[System.Drawing.FontStyle]::Bold)
$labelCurrentDir.Anchor = [System.Windows.Forms.AnchorStyles]::Top -bor `
                          [System.Windows.Forms.AnchorStyles]::Left -bor `
                          [System.Windows.Forms.AnchorStyles]::Right
$form.Controls.Add($labelCurrentDir)

# Listbox for files and folders
$listBox = New-Object System.Windows.Forms.ListBox
$listBox.Location = New-Object System.Drawing.Point(10,40)
$listBox.Size = New-Object System.Drawing.Size(760,350)
$listBox.SelectionMode = "One"
$listBox.Anchor = [System.Windows.Forms.AnchorStyles]::Top -bor `
                  [System.Windows.Forms.AnchorStyles]::Left -bor `
                  [System.Windows.Forms.AnchorStyles]::Right -bor `
                  [System.Windows.Forms.AnchorStyles]::Bottom
$form.Controls.Add($listBox)

# Textbox to show messages (like file list), smaller now since file content opens in new window
$textBoxOutput = New-Object System.Windows.Forms.TextBox
$textBoxOutput.Location = New-Object System.Drawing.Point(10, 400)
$textBoxOutput.Size = New-Object System.Drawing.Size(760, 80)
$textBoxOutput.Multiline = $true
$textBoxOutput.ScrollBars = "Vertical"
$textBoxOutput.ReadOnly = $true
$textBoxOutput.Font = New-Object System.Drawing.Font("Consolas",9)
$textBoxOutput.BackColor = [System.Drawing.Color]::FromArgb(30,30,30)
$textBoxOutput.ForeColor = [System.Drawing.Color]::White
$textBoxOutput.Anchor = [System.Windows.Forms.AnchorStyles]::Left -bor `
                        [System.Windows.Forms.AnchorStyles]::Right -bor `
                        [System.Windows.Forms.AnchorStyles]::Bottom
$form.Controls.Add($textBoxOutput)

# Buttons settings
$buttonWidth = 120
$buttonHeight = 35
$buttonSpacing = 10
$buttonTop = 490
$buttonLeftStart = 10

function New-Button($text, $x) {
    $btn = New-Object System.Windows.Forms.Button
    $btn.Text = $text
    $btn.Size = New-Object System.Drawing.Size($buttonWidth, $buttonHeight)
    $btn.Location = New-Object System.Drawing.Point($x, $buttonTop)
    $btn.Anchor = [System.Windows.Forms.AnchorStyles]::Bottom -bor [System.Windows.Forms.AnchorStyles]::Left
    return $btn
}

$buttonRoot = New-Button "Go to Root (C:\)" $buttonLeftStart
$buttonUp = New-Button "Go Back (..)" ($buttonLeftStart + ($buttonWidth + $buttonSpacing)*1)
$buttonChangeDir = New-Button "Open Directory" ($buttonLeftStart + ($buttonWidth + $buttonSpacing)*2)
$buttonSelectFile = New-Button "Select File" ($buttonLeftStart + ($buttonWidth + $buttonSpacing)*3)
$buttonListFiles = New-Button "List Files" ($buttonLeftStart + ($buttonWidth + $buttonSpacing)*4)

$form.Controls.AddRange(@(
    $buttonRoot,
    $buttonUp,
    $buttonChangeDir,
    $buttonSelectFile,
    $buttonListFiles
))

# Quit button on bottom right
$buttonQuit = New-Object System.Windows.Forms.Button
$buttonQuit.Text = "Quit"
$buttonQuit.Size = New-Object System.Drawing.Size($buttonWidth, $buttonHeight)
# Set initial position (will update on resize)
$buttonQuit.Location = New-Object System.Drawing.Point($form.ClientSize.Width - $buttonWidth - 10, $buttonTop)
$buttonQuit.Anchor = [System.Windows.Forms.AnchorStyles]::Bottom -bor [System.Windows.Forms.AnchorStyles]::Right
$form.Controls.Add($buttonQuit)

# Adjust Quit button position on resize (cast to int to avoid error)
$form.Add_Resize({
    $newX = [int]($form.ClientSize.Width - $buttonWidth - 10)
    $buttonQuit.Location = New-Object System.Drawing.Point($newX, $buttonTop)
})

# Initialize current directory variable
$currentDir = Get-Location

# Function to update directory label and listbox items
function Update-View {
    $labelCurrentDir.Text = "Current directory: $($currentDir.Path)"
    $listBox.Items.Clear()

    # Add directories first, with [DIR] prefix
    Get-ChildItem -Path $currentDir -Directory | ForEach-Object {
        $listBox.Items.Add("[DIR] $_")
    }

    # Then add files
    Get-ChildItem -Path $currentDir -File | ForEach-Object {
        $listBox.Items.Add($_.Name)
    }
}

# Helper function to safely change directory
function Try-SetLocation ($path) {
    if (Test-Path -Path $path -PathType Container) {
        Set-Location -Path $path
        $true
    } else {
        [System.Windows.Forms.MessageBox]::Show("Directory does not exist:`n$path", "Error", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
        $false
    }
}

# New function to open file content window
function Show-FileContentWindow($filePath) {
    # Create new form
    $fileForm = New-Object System.Windows.Forms.Form
    $fileForm.Text = "Viewing: " + (Split-Path $filePath -Leaf)
    $fileForm.Size = New-Object System.Drawing.Size(700, 500)
    $fileForm.StartPosition = "CenterParent"
    $fileForm.FormBorderStyle = 'Sizable'
    $fileForm.MinimumSize = New-Object System.Drawing.Size(400, 300)

    # Textbox to show file content
    $contentBox = New-Object System.Windows.Forms.TextBox
    $contentBox.Multiline = $true
    $contentBox.ReadOnly = $true
    $contentBox.ScrollBars = "Both"
    $contentBox.WordWrap = $false
    $contentBox.Font = New-Object System.Drawing.Font("Consolas",10)
    $contentBox.Dock = "Fill"
    $contentBox.BackColor = [System.Drawing.Color]::FromArgb(30,30,30)
    $contentBox.ForeColor = [System.Drawing.Color]::White

    try {
        $contentBox.Text = Get-Content $filePath -Raw -ErrorAction Stop
    } catch {
        $contentBox.Text = "Error reading file:`r`n$($_.Exception.Message)"
    }

    $fileForm.Controls.Add($contentBox)

    $fileForm.ShowDialog()
}

# Button click events

$buttonRoot.Add_Click({
    if (Try-SetLocation "C:\") {
        $currentDir = Get-Location
        Update-View
        $textBoxOutput.Clear()
    }
})

$buttonUp.Add_Click({
    $parentDir = Split-Path (Get-Location) -Parent
    if ([string]::IsNullOrEmpty($parentDir)) {
        [System.Windows.Forms.MessageBox]::Show("Already at root directory.", "Info", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
    } elseif (Try-SetLocation $parentDir) {
        $currentDir = Get-Location
        Update-View
        $textBoxOutput.Clear()
    }
})

$buttonChangeDir.Add_Click({
    if ($listBox.SelectedItem -and $listBox.SelectedItem.StartsWith("[DIR]")) {
        $currentDir = Get-Location
        $dirName = $listBox.SelectedItem -replace "^\[DIR\] ", ""
        $newPath = Join-Path $currentDir $dirName
        if (Try-SetLocation $newPath) {
            $currentDir = Get-Location
            Update-View
            $textBoxOutput.Clear()
        }
    } else {
        [System.Windows.Forms.MessageBox]::Show("Please select a directory to open.", "Info", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
    }
})

$buttonSelectFile.Add_Click({
    if ($listBox.SelectedItem -and -not $listBox.SelectedItem.StartsWith("[DIR]")) {
        $currentDir = Get-Location
        $fileName = $listBox.SelectedItem
        $filePath = Join-Path $currentDir $fileName

        # Open file content window directly (no "view or run" prompt here)
        Show-FileContentWindow $filePath
    } else {
        [System.Windows.Forms.MessageBox]::Show("Please select a file to open.", "Info", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
    }
})

$buttonListFiles.Add_Click({
    $currentDir = Get-Location
    $files = Get-ChildItem -Path $currentDir -File | ForEach-Object { $_.Name }
    $textBoxOutput.Text = "Files in current directory:`r`n" + ($files -join "`r`n")
})

$buttonQuit.Add_Click({
    $form.Close()
})

# Double-click event on listbox
$listBox.Add_MouseDoubleClick({
    $selected = $listBox.SelectedItem
    if (-not $selected) { return }

    if ($selected.StartsWith("[DIR]")) {
        $currentDir = Get-Location
        $dirName = $selected -replace "^\[DIR\] ", ""
        $newPath = Join-Path $currentDir $dirName
        if (Try-SetLocation $newPath) {
            $currentDir = Get-Location
            Update-View
            $textBoxOutput.Clear()
        }
    } else {
        $currentDir = Get-Location
        $fileName = $selected
        $filePath = Join-Path $currentDir $fileName

        Show-FileContentWindow $filePath
    }
})

# Initial load
Update-View

# Show form
[void] $form.ShowDialog()
