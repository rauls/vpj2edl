VPJ2EDL
========

## Overview

A simple converter that will import and convert an existing VIDEOPAD PRO
project file (.vpj) by NCH Software into industry standard output EDL file
format that will open up in other video editors such as OpenShot or
DaVinci Resolve Editor. It will also output the data as JSON so you can 
process it to something else.

## Installation

`npm install vpj2edl`

`git clone https://rauls@github.com/rauls/vpj2edl.git`

## Examples

### Consumer

vpj2edl.js -s OpenYourMind-video/OpenYourMind.vpj -edl

### EDL OUTPUT
TITLE Clips - TRACK 3
FCM: NON-DROP FRAME
001  BL       V     C        00:00:00:00 00:00:01:21 00:00:00:00 00:00:01:21
* FROM CLIP NAME: 170307_Particles_07_1080p.mp4
002  BL       V     C        00:00:00:00 00:00:02:03 00:00:01:06 00:00:03:10
* FROM CLIP NAME: Blue_and_Orange_Vortex.mp4
003  BL       V     C        00:00:00:14 00:00:11:24 00:00:03:10 00:00:14:20
* FROM CLIP NAME: DNAStrandRotateLoopVidevo.mov
004  BL       V     C        00:00:00:00 00:00:07:10 00:00:14:05 00:00:21:16
* FROM CLIP NAME: Silky_Blue_4K_Motion_Background_Loop.mp4
005  BL       V     C        00:00:00:00 00:00:05:04 00:00:21:16 00:00:26:20
* FROM CLIP NAME: CROWD_JUMPS_LIGHTS_PULSE.mov
006  BL       V     C        00:00:04:01 00:00:07:15 00:00:26:20 00:00:30:04
* FROM CLIP NAME: MUSICEXPRESS LIGHT4ME 4 DISCO Efekt LED RGBWA mocny solidny.mp4
007  BL       V     C        00:00:49:05 00:00:52:14 00:00:30:04 00:00:33:13
* FROM CLIP NAME: MUSICEXPRESS LIGHT4ME 4 DISCO Efekt LED RGBWA mocny solidny.mp4
008  BL       V     C        00:00:00:00 00:00:02:28 00:00:33:13 00:00:36:11

### Contributors

raul.sobon -at- gmail.com

