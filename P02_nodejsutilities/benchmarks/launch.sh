# launch test with timming report

echo "node output (async)"
node mysql_insert_loop.js

#echo "python output (sync mono thread)"
#python mysql_insert_loop.py

echo "Reports"
echo "node output (async)"
time node mysql_insert_loop.js >> /dev/null 
echo "python output (sync mono thread)"
time python mysql_insert_loop.py >> /dev/null
