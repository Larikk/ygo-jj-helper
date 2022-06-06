#!/bin/bash

if ! [ -L ygo-jj-helper ]; then
    ln -s docs/ ygo-jj-helper
fi
{ sleep 0.5; xdg-open http://localhost:8050/ygo-jj-helper/index.html; } &
python -m http.server 8050
