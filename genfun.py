#!/usr/bin/python
#coding:utf-8
import os
import time

dir='./'

files = []

def fr(dir,prefix):
  filelist=os.listdir(dir)
  for i in filelist:
    fullfile=os.path.join(dir,i)
    if not os.path.isdir(fullfile):
      if i == "index.js":                    
        #print fullfile
        files.append(fullfile)
        #print prefix + "<file>" + i + "</file>"
    else:
        #print prefix + "<"+i + ">"
        fr(fullfile, prefix + "  ")
        #print prefix + "</"+i + ">"

def print_files(arr_file):
      
  #print function head
  print "import React, { PropTypes } from 'react';"
  print "import {Route} from 'react-router';"
  #print "import { Router, Route, IndexRoute, Link, IndexRedirect } from 'react-router';"
  print "\n\n"
  print "export const generateRoutes = () => {"

  print "    console.log(\"genRoterTime: " + time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())) + "\");\n" 



  print "    const result = [];\n"
      


  for file in arr_file:
    #print "files: " + file

    if file == "./index.js":
      #print "file: " + file + " continue!"
      continue

    parts = file.split('/')
    module = parts[1]

    path = []
    for p in parts:
      if p == "." or p == "index.js":
        continue
      path.append(p)  

        
    rpath =  "/".join(path)
    rpath2 = "../apps" + "/" + rpath
    #print "path:" +  rpath

    #print "module: " + module
    #print router
    print "    result.push("
    print "    <Route key=\"" + rpath +"\" path=" + "\"" + rpath +"\"" + " getComponent={(location, cb) => { \n\
        require.ensure([], require => {  \n\
            cb(null, require(\'" + rpath2 + "\')) \n\
          }, \'"+ module +"\') \n\
        }} />\n"
    print "    );"

  #print function end
  print "    return result;"
  print "}"

fr(dir, "")
print_files(files)
