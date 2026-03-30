@echo off
cd /d C:\Users\docto\Downloads\dashboard-agente-thales
del do_push.bat
git add -A
git commit -m "chore: cleanup"
git push origin main
del cleanup.bat