/*jshint devel: true */
/* globals require, module */
"use strict";
var fs = require('fs'),
    queue = require('queue-async'),
    d3dsv = require('d3-dsv'),
    lodash = require('lodash');

module.exports  = {

    toMatrix: function (flowsFile, resultFile, regionsFile, yearsFile) {
        var flows;

        function readInput(error, movements, regions, years) {
            var data = {
                years: {},
                migrations: {},
                regions: {}
            },
                sortedRegions = [],
                objs = [],
                regionCountryNamesMapping,
                matrix = {};


            if (error) {
                console.log(error);
            }

            objs = d3dsv.csv.parse(years);
            objs.forEach(function (d) { data.years[d.year] = {}; });
            years = Object.keys(data.years);

            objs = d3dsv.csv.parse(regions);
            sortedRegions = objs.map(function (d) { return d.name; });

            objs = d3dsv.csv.parse(movements);



            var value,
                origin_country,
                origin_region;
            objs.forEach(function (d) {
                // collect region-country mappings
                origin_region = data.regions[d.originregion_name] = data.regions[d.originregion_name] || [];
                if (origin_region.indexOf(d.origin_name) === -1) {
                    origin_region.push(d.origin_name);
                }

                // collect migration data
                origin_country = data.migrations[d.origin_name] = data.migrations[d.origin_name] || {};
                // country to country
                origin_country[d.destination_name] = origin_country[d.destination_name] || {};
                // country to region
                origin_country[d.destinationregion_name] = origin_country[d.destinationregion_name] || {};
                origin_region = data.migrations[d.originregion_name] = data.migrations[d.originregion_name] || {};
                // region to country
                origin_region[d.destination_name] = origin_region[d.destination_name] || {};
                // region to region
                origin_region[d.destinationregion_name] = origin_region[d.destinationregion_name] || {};

                years.forEach(function (year) {
                    value = parseInt(d['countryflow_' + year], 10);
                    // country to country
                    origin_country[d.destination_name][year] = value;
                    // country to region
                    origin_country[d.destinationregion_name][year] = origin_country[d.destinationregion_name][year] || 0;
                    origin_country[d.destinationregion_name][year] += value;
                    // region to country
                    origin_region[d.destination_name][year] = origin_region[d.destination_name][year] || 0;
                    origin_region[d.destination_name][year] += value;
                    // region to region
                    origin_region[d.destinationregion_name][year] = origin_region[d.destinationregion_name][year] || 0;
                    origin_region[d.destinationregion_name][year] += value;
                });

            });

            function regional (memo, region) {
                memo.indices.push(memo.keys.length);
                memo.keys.push(region);
                memo.keys = memo.keys.concat(data.regions[region] && data.regions[region].sort());
                return memo;
            }

            regionCountryNamesMapping = lodash.union(sortedRegions, Object.keys(data.regions)).reduce(regional, {indices: [], keys: []});

            years.forEach(function (year) {
                matrix[year] = regionCountryNamesMapping.keys.map(function (source) {
                    return regionCountryNamesMapping.keys.map(function (destination) {
                        return data.migrations[source] &&
                            data.migrations[source][destination] &&
                            data.migrations[source][destination][year];
                    });
                });
            });

            // names: list of regions and countries names
            // regions: indexes (in the list above) of the regions names
            // matrix: array of flow matrix, one entry per temporal event (year), i.e. matrix[2014]
            flows =  {
                names: regionCountryNamesMapping.keys,
                regions: regionCountryNamesMapping.indices,
                matrix: matrix
            };

            fs.writeFile(resultFile, JSON.stringify(flows));

        }


        queue()
            .defer(fs.readFile, flowsFile, "utf8")
            .defer(fs.readFile, regionsFile, "utf8")
            .defer(fs.readFile, yearsFile, "utf8")
            .await(readInput);

    }

};

