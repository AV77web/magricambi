@echo-off
cd /d D:\maga\magricambi
git status
echo.
set /p MSG=Messaggio commit:
if "%MSG%"=="" (
    echo Messaggio obbligatorio.
    exit /b 1
)
git add .
git status
set /p OK="Proceder con commit e push?" (s/N):
if /i not "%OK%" == "s" exit /b 0
git commit -m "%MSG%"
git push -u origin main 