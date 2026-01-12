@echo off
set WT="%LOCALAPPDATA%\Microsoft\WindowsApps\wt.exe"

%WT% ^
new-tab cmd /k "cd /d %~dp0AuthService && air" ^
; new-tab cmd /k "cd /d %~dp0EvaluationService && npm run dev" ^
; new-tab cmd /k "cd /d %~dp0ProblemService && npm run dev" ^
; new-tab cmd /k "cd /d %~dp0SubmissionService && npm run dev" ^
; new-tab cmd /k "cd /d %~dp0ClientUI && npm run dev"
