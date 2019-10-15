#!/usr/bin/env bash

mysql -u pasdt -pZiAEfboYP0uv -h pasdt003.spin-io.fr -P 3306 -D pasdt -e "select id, cardId, msg, eventType, options, created_at, updated_at from log ORDER BY id DESC" > public/json/data/dump.csv && csvtojson --delimiter="\t" public/json/data/dump.csv > public/json/data/dump.json