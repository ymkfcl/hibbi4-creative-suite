# 🚀 Script d'Installation Automatique HIBBI4 Creative Suite
# Exécuter avec: PowerShell -ExecutionPolicy Bypass -File setup.ps1

Write-Host "🚀 HIBBI4 Creative Suite - Installation Automatique" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

# Fonction pour afficher les messages colorés
function Write-Status {
    param(
        [string]$Message,
        [string]$Status = "INFO"
    )
    
    switch ($Status) {
        "SUCCESS" { Write-Host "✅ $Message" -ForegroundColor Green }
        "ERROR" { Write-Host "❌ $Message" -ForegroundColor Red }
        "WARNING" { Write-Host "⚠️ $Message" -ForegroundColor Yellow }
        "INFO" { Write-Host "ℹ️ $Message" -ForegroundColor Blue }
        default { Write-Host "$Message" }
    }
}

# Vérifier si nous sommes dans le bon dossier
$currentPath = Get-Location
if (-not (Test-Path "package.json")) {
    Write-Status "Veuillez exécuter ce script depuis le dossier frontend du projet" "ERROR"
    exit 1
}

Write-Status "Dossier de travail: $currentPath" "INFO"

# 1. Vérifier Node.js
Write-Host "`n📋 1. Vérification de Node.js" -ForegroundColor Yellow

try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Status "Node.js détecté: $nodeVersion" "SUCCESS"
        
        # Vérifier la version minimale
        $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
        if ($versionNumber -lt 16) {
            Write-Status "Version Node.js trop ancienne (minimum: v16)" "WARNING"
        }
    }
} catch {
    Write-Status "Node.js non détecté" "ERROR"
    Write-Host "📥 Installation de Node.js requise:" -ForegroundColor Yellow
    Write-Host "   1. Aller sur https://nodejs.org/" -ForegroundColor White
    Write-Host "   2. Télécharger la version LTS" -ForegroundColor White
    Write-Host "   3. Installer et redémarrer PowerShell" -ForegroundColor White
    Write-Host "   4. Relancer ce script" -ForegroundColor White
    
    # Essayer d'installer avec winget si disponible
    try {
        winget --version 2>$null | Out-Null
        Write-Host "`n🔧 Tentative d'installation automatique avec winget..." -ForegroundColor Blue
        winget install OpenJS.NodeJS
        Write-Status "Installation terminée. Redémarrez PowerShell et relancez ce script." "SUCCESS"
    } catch {
        Write-Status "winget non disponible. Installation manuelle requise." "WARNING"
    }
    
    exit 1
}

# 2. Vérifier npm
Write-Host "`n📦 2. Vérification de npm" -ForegroundColor Yellow

try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Status "npm détecté: v$npmVersion" "SUCCESS"
    }
} catch {
    Write-Status "npm non détecté" "ERROR"
    exit 1
}

# 3. Vérifier les variables d'environnement
Write-Host "`n⚙️ 3. Vérification de la configuration" -ForegroundColor Yellow

if (Test-Path ".env.local") {
    Write-Status "Fichier .env.local trouvé" "SUCCESS"
    
    $envContent = Get-Content ".env.local" -Raw
    
    if ($envContent -match "NEXT_PUBLIC_SUPABASE_URL=https://\w+\.supabase\.co") {
        Write-Status "URL Supabase configurée" "SUCCESS"
    } else {
        Write-Status "URL Supabase non configurée ou invalide" "WARNING"
    }
    
    if ($envContent -match "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ") {
        Write-Status "Clé Supabase configurée" "SUCCESS"
    } else {
        Write-Status "Clé Supabase non configurée" "WARNING"
    }
} else {
    Write-Status "Fichier .env.local manquant" "ERROR"
    Write-Host "📝 Création du fichier .env.local depuis .env.example..." -ForegroundColor Blue
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Status "Fichier .env.local créé. Veuillez le configurer avec vos clés Supabase." "WARNING"
    } else {
        Write-Status "Fichier .env.example manquant" "ERROR"
    }
}

# 4. Installation des dépendances
Write-Host "`n📁 4. Installation des dépendances" -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Status "Dossier node_modules manquant. Installation des dépendances..." "INFO"
    
    try {
        Write-Host "⏳ Installation en cours (cela peut prendre quelques minutes)..." -ForegroundColor Blue
        npm install
        Write-Status "Dépendances installées avec succès" "SUCCESS"
    } catch {
        Write-Status "Erreur lors de l'installation des dépendances" "ERROR"
        Write-Host "💡 Essayez manuellement: npm install" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Status "Dossier node_modules présent" "SUCCESS"
    
    # Vérifier si Supabase est installé
    if (Test-Path "node_modules/@supabase") {
        Write-Status "Modules Supabase installés" "SUCCESS"
    } else {
        Write-Status "Modules Supabase manquants. Installation..." "WARNING"
        try {
            npm install @supabase/supabase-js @supabase/auth-ui-react @supabase/auth-ui-shared
            Write-Status "Modules Supabase installés" "SUCCESS"
        } catch {
            Write-Status "Erreur lors de l'installation des modules Supabase" "ERROR"
        }
    }
}

# 5. Vérification des fichiers d'authentification
Write-Host "`n🔐 5. Vérification des fichiers d'authentification" -ForegroundColor Yellow

$authFiles = @(
    "src/lib/supabase.ts",
    "src/contexts/AuthContext.tsx",
    "src/components/auth/AuthModal.tsx",
    "src/components/auth/CreditsDisplay.tsx",
    "src/components/auth/UserProfile.tsx",
    "src/hooks/useAuthGuard.ts"
)

$missingFiles = @()
foreach ($file in $authFiles) {
    if (Test-Path $file) {
        Write-Status "$(Split-Path $file -Leaf) présent" "SUCCESS"
    } else {
        Write-Status "$(Split-Path $file -Leaf) manquant" "ERROR"
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Status "$($missingFiles.Count) fichiers d'authentification manquants" "ERROR"
}

# 6. Vérification du schema SQL
Write-Host "`n🗄️ 6. Vérification du schema Supabase" -ForegroundColor Yellow

if (Test-Path "supabase-schema.sql") {
    Write-Status "Schema SQL présent" "SUCCESS"
    Write-Host "📋 N'oubliez pas d'exécuter ce schema dans votre dashboard Supabase !" -ForegroundColor Blue
} else {
    Write-Status "Schema SQL manquant" "ERROR"
}

# 7. Test de compilation
Write-Host "`n🔧 7. Test de compilation" -ForegroundColor Yellow

try {
    Write-Host "⏳ Test de compilation Next.js..." -ForegroundColor Blue
    $buildOutput = npm run build 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Compilation réussie" "SUCCESS"
    } else {
        Write-Status "Erreurs de compilation détectées" "WARNING"
        Write-Host "📋 Détails des erreurs:" -ForegroundColor Yellow
        Write-Host $buildOutput -ForegroundColor Red
    }
} catch {
    Write-Status "Impossible de tester la compilation" "WARNING"
}

# 8. Résumé final
Write-Host "`n" + "=" * 60 -ForegroundColor Gray
Write-Host "📊 RÉSUMÉ DE L'INSTALLATION" -ForegroundColor Cyan

$allGood = $true

# Vérifications finales
if (-not (Test-Path "node_modules")) { $allGood = $false }
if (-not (Test-Path ".env.local")) { $allGood = $false }
if ($missingFiles.Count -gt 0) { $allGood = $false }

if ($allGood) {
    Write-Host "🎉 INSTALLATION RÉUSSIE !" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Pour lancer l'application:" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Puis ouvrir dans le navigateur:" -ForegroundColor Yellow
    Write-Host "   http://localhost:3000" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Étapes suivantes:" -ForegroundColor Yellow
    Write-Host "   1. Configurer Supabase (voir SUPABASE_SETUP.md)" -ForegroundColor White
    Write-Host "   2. Exécuter le schema SQL dans Supabase" -ForegroundColor White
    Write-Host "   3. Tester l'authentification" -ForegroundColor White
} else {
    Write-Host "⚠️ INSTALLATION INCOMPLÈTE" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Actions requises:" -ForegroundColor Yellow
    Write-Host "   1. Vérifier les erreurs ci-dessus" -ForegroundColor White
    Write-Host "   2. Configurer .env.local avec vos clés Supabase" -ForegroundColor White
    Write-Host "   3. Relancer ce script si nécessaire" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 Consultez INSTALLATION_GUIDE.md pour plus de détails" -ForegroundColor Blue
}

Write-Host "=" * 60 -ForegroundColor Gray

# Proposer de lancer l'application si tout est OK
if ($allGood) {
    Write-Host ""
    $response = Read-Host "Voulez-vous lancer l'application maintenant ? (o/N)"
    if ($response -eq "o" -or $response -eq "O" -or $response -eq "oui") {
        Write-Host "🚀 Lancement de l'application..." -ForegroundColor Green
        npm run dev
    }
}