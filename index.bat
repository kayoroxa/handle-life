@echo off

REM Atualiza as referências do repositório remoto
git fetch

REM Obtém o nome da branch atual
FOR /F "tokens=*" %%i IN ('git symbolic-ref --short HEAD') DO SET CURRENT_BRANCH=%%i

REM Obtém o número de commits que precisam ser puxados
FOR /F "tokens=*" %%i IN ('git rev-list --count %CURRENT_BRANCH%...origin/%CURRENT_BRANCH%') DO SET COUNT=%%i

REM Verifica se COUNT é maior que 0
IF %COUNT% GTR 0 (
    echo Updating... there are %COUNT% changes to be changes to be pulled.
    call yarn spb
)

REM Inicia o navegador e o servidor
start msedge http://localhost:6700
call yarn start