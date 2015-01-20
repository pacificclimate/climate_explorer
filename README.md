wget --output-document=myfile.txt --header "Cookie: beaker.session.id=160e7a46fa0145f7a66ccf23c5c7a131" http://tools.pcic.uvic.ca/dataportal/bc_prism/data/tmax_monClim_PRISM_historical_run1_197101-200012.nc

As csv
wget --output-document=- --header "Cookie: beaker.session.id=160e7a46fa0145f7a66ccf23c5c7a131" http://tools.pcic.uvic.ca/dataportal/bc_prism/data/tmax_monClim_PRISM_historical_run1_197101-200012.nc.csv

so to get the yearly values (13th timestep)
wget --output-document=- --header "Cookie: beaker.session.id=160e7a46fa0145f7a66ccf23c5c7a131" http://tools.pcic.uvic.ca/dataportal/bc_prism/data/tmax_monClim_PRISM_historical_run1_197101-200012.nc.csv?tmax[13][0:16800][0:32410]  2> /dev/null

# Get all the tmax data
wget --output-document=tmax.nc --header "Cookie: beaker.session.id=160e7a46fa0145f7a66ccf23c5c7a131" http://tools.pcic.uvic.ca/dataportal/bc_prism/data/tmax_monClim_PRISM_historical_run1_197101-200012.nc?tmax[0:13][0:16800][0:32410]  2> /dev/null


projection needs to be $EPSG:4269 - NAD83

convert to Geotiff and select band (band represents month number)
gdal_translate -of GTiff NETCDF:"/Users/mathewbrown/projects/PCIC/tmax.nc":tmax -b 3 /Users/mathewbrown/projects/PCIC/build/mar.tif

- TO this final step, then load into QGIS and set color. Save as rendered image and then run makefile