# work as an script: chmod +x filename.js
#/usr/bin/env python

import time,mysql.connector

for i in xrange(100):
	conn = mysql.connector.connect(host= "localhost",
                  user="root",
                  passwd="temporal",
                  db="node_test")
	try:
		x = conn.cursor()
   		x.execute("INSERT INTO example (data) VALUES (%s)" % time.time())
   		conn.commit()
		conn.close()
		print "element inserted"
	except:
   		print "error"
