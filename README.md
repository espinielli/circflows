# A Circular Plot library in D3.js

## Rationale

The idea behind this repo is to provide an easy setup and all the documentation necessary to
set a circular plot up starting from a set of observations in a CSV file.

## Origins and Credits

The code is directly copied from [Null2](http://null2.net/)'s [implementation](https://github.com/null2/globalmigration)
in [D3.js](https://d3js.org). We strive not to diverge from that code base and so we try to feed the original repo back
whenever we think some extensions, cleanup or fixes are needed.
We have done so via some Pull Requests.


## Data preparation

`Origin` (`destination`) is something like an airport, while `origingroup` (`destinationgroup`) is something like its
country.

We start from a test CSV file `test_data.csv.orig` logically organized as follows:

| time | origin | origingroup | destination | destinationgroup | measure |
|------|--------|-------------|-------------|------------------|---------|
|    0 |  a1    |  a          |  b2         |  b               |  17     |
|    0 |  a1    |  a          |  b3         |  b               |  19     |
|  ... |  ...   |  ...        |  ...        |  ...             |  ...    |
|    1 |  a1    |  a          |  b3         |  b               |  191    |


Transform `test_data.csv.orig` headings to the ones expected by `csv2flowmatrix.js`:

```bash
$ bin/gen_flows
```


Get the list of origins/destinations:

```bash
$ cat \
    <(echo 'iso,name,show') \
    <(sort \
        <(cat data/test_data.csv.orig | tail --lines=+2 | grep -E -v '^[[:space:]]*$' | cut -d, -f2) \
        <(cat data/test_data.csv.orig | tail --lines=+2 | grep -E -v '^[[:space:]]*$' | cut -d, -f4) \
        | uniq | sed -e 's/^\(.*\)$/\1,\1,1/g') > data/test_countries.csv
```


Get the list of origingroups/destinationgroups:

```bash
$ cat \
    <(echo 'name') \
    <(sort \
        <(cat data/test_data.csv.orig | tail --lines=+2 | grep -E -v '^[[:space:]]*$' | cut -d, -f3) \
        <(cat data/test_data.csv.orig | tail --lines=+2 | grep -E -v '^[[:space:]]*$' | cut -d, -f5) \
       | uniq) > data/test_regions.csv
```


Get all the years:

```bash
$ cat \
    <(echo 'year') \
    <(sort \
        <(cat data/test_data.csv.orig | tail --lines=+2 | grep -E -v '^[[:space:]]*$' | cut -d, -f1) \
       | uniq) > data/test_years.csv
```


All these steps are performed by the script `gen_test_data` and the test data can be generated via npm:

```bash
$ npm run -s compile:test
```



## The Parts of the Plot

The aim of this part is to describe the 3 different blocks of the graph and to detail how they can be customized via
the configuration parameters, CSS and/or javascript.

### The Circle

### The Timeline

### The Play/Stop Commands


<!-- -*- mode: markdown; -*- -->