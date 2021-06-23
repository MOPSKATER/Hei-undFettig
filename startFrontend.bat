@echo off

@REM Backend address
set BACKEND="http://localhost:3001"

cd Frontend

cls

npm start %BACKEND%
