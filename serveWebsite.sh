#!/bin/bash

ln -s docs/ ygo-jj-helper
{ sleep 0.5; xdg-open http://localhost:8050/ygo-jj-helper/index.html; } &
python -m http.server 8050
