---
title: "jq cheatsheet"
description: "A quick reference for jq — the lightweight and flexible command-line JSON processor."
date: 2021-10-22
tags: [linux, cli, json]
---

**jq** is a lightweight and flexible command-line JSON processor, it is also described as sed for JSON data: You can use it to slice and filter and map and transform structured data with the same ease.

We'll use below endpoint as example `https://reqres.in/api/users` which provides response in json format.

## Beautify json

```bash
curl https://reqres.in/api/users | jq .
```

## Print value of top level attribute

```bash
curl https://reqres.in/api/users | jq .page
```

output:

```
1
```

## Print all items in top level array element `data`

```bash
curl 'https://reqres.in/api/users' | jq .data
```

## Print key, values in array element `data`

```bash
curl 'https://reqres.in/api/users' | jq '.data[] | {first_name,last_name}'
```

## Print only values from array element `data`

```bash
curl 'https://reqres.in/api/users' | jq '.data[].first_name'
```

## Print first_name and last_name as `text` instead of `json`

```bash
curl 'https://reqres.in/api/users' | jq '.data[] | {first_name,last_name} | join(" ")'
```

## Get all records for person with `first_name` `Eve`

```bash
curl 'https://reqres.in/api/users' | jq '.data[] | select(.first_name == "Eve")'
```

## Get `email` of a person with `first_name` `Eve`

```bash
curl 'https://reqres.in/api/users' | jq '.data[] | select(.first_name == "Eve") | {email}'
```

## Extract all `keys` from json

```bash
curl 'https://reqres.in/api/users' | jq keys
```

## Print range from array `data`

```bash
curl 'https://reqres.in/api/users' | jq '.data[1:3]'
```

## Sort array `data` by `first_name`

```bash
curl 'https://reqres.in/api/users' | jq '.data | sort_by(.first_name)'
```

## Count elements in subscripted array `data`

```bash
curl 'https://reqres.in/api/users' | jq '.data | length'
```

output:

```
6
```

Try these examples [here](https://jqplay.org/s/oHvsbJdxw7) as well — json is pre-loaded.
