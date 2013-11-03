#!/usr/bin/env bash

appname="stem";

start ()
{ 
	echo "starting $appname";
} 


stop ()
{ 
	echo "stopping $appname";
} 

execute_command ()
{
    if [ ! $1 ] ; then echo "no params"; return; fi
    case "$1" in
      "start")
		start
        ;;
      "stop")
		stop
        ;;
      "?")
        echo "Unknown option $1"
        ;;
      ":")
        echo "No argument value for execute option $1"
        ;;
      *)
      # Should not occur
        echo "Unknown error while processing options"
        ;;
    esac
}


while getopts ":x:v:" optname
  do
    case "$optname" in
      "v")
        echo "Option $optname (verbose) is active"
        ;;
      "x")
        echo "Option $optname (command) has value $OPTARG"
	execute_command $OPTARG;
        ;;
      "?")
        echo "Unknown option $OPTARG"
        ;;
      ":")
        if [[ "$OPTARG" == "x" ]] ; then echo "No argument value for option $OPTARG" ; fi
        ;;
      *)
      # Should not occur
        echo "Unknown error while processing options"
        ;;
    esac
  done
