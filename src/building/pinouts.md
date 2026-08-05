---
title: Pinouts
extraCss: pinout.css
eleventyNavigation:
  parent: building
  key: pinouts
  title: Pinouts
  order: 5
---

# Pinouts

Every pin on the Pi's 40-pin header is spoken for. Before you solder anything onto a free GPIO, or try to work out why a HAT you added stopped the LCD, check it here.

These are the wiring diagrams from the old wiki, transcribed so you can search them and copy from them. The colours match the legend beside each one.

## v3

<div class="pinout pinout-v3">
<table class="pinkey">
<caption>Key</caption>
<tr><td class="gnd">GND</td></tr>
<tr><td class="v5">5v</td></tr>
<tr><td class="v3">3v</td></tr>
<tr><td class="lcd">SPI LCD</td></tr>
<tr><td class="adc">SPI ADC</td></tr>
<tr><td class="iq">IQAudio</td></tr>
<tr><td class="rot">Encoder Rotary</td></tr>
<tr><td class="sw">Encoder Switch</td></tr>
<tr><td class="i2c">i2C expansion</td></tr>
<tr><td class="led">LED's (one wire)</td></tr>
</table>
<table class="pinmain">
<caption>V3 Pinout</caption>
<tr><th class="e"></th><th>GPIO</th><th>Pin</th><th>Pin</th><th>GPIO</th><th class="e"></th></tr>
<tr><td class="lcd">LCD 3v</td><td class="lcd n">3.3</td><td class="v3 n">1</td><td class="v5 n">2</td><td class="lcd">5v</td><td class="lcd">LCD 5v</td></tr>
<tr><td class="e"></td><td class="iq n b">2</td><td class="n">3</td><td class="v5 n">4</td><td class="iq">5v</td><td></td></tr>
<tr><td class="e"></td><td class="iq n b">3</td><td class="n">5</td><td class="gnd n">6</td><td>GND</td><td></td></tr>
<tr><td class="rot">EncoderNav</td><td class="n">4</td><td class="n">7</td><td class="n">8</td><td>14 TX</td><td class="midi">UART Midi Out</td></tr>
<tr><td class="e"></td><td class="lcd">GND</td><td class="gnd n">9</td><td class="n">10</td><td>15 RX</td><td class="midi">UART Midi In</td></tr>
<tr><td class="rot">EncoderNav</td><td class="n">17</td><td class="n">11</td><td class="n">12</td><td class="iq n b">18</td><td></td></tr>
<tr><td class="rot">Encoder3</td><td class="n">27</td><td class="n">13</td><td class="gnd n">14</td><td>GND</td><td></td></tr>
<tr><td class="rot">Encoder3</td><td class="n">22</td><td class="n">15</td><td class="n">16</td><td class="n">23</td><td class="rot">Encoder2</td></tr>
<tr><td class="adc">MCP (+3)</td><td class="iq n b">3.3</td><td class="v3 n">17</td><td class="n">18</td><td class="n">24</td><td class="rot">Encoder2</td></tr>
<tr><td class="adc">MCP MOSI</td><td class="lcd n">10</td><td class="n">19</td><td class="gnd n">20</td><td>GND</td><td></td></tr>
<tr><td class="adc">MCP MISO</td><td class="n">9</td><td class="n">21</td><td class="n">22</td><td class="n">25</td><td class="rot">Encoder1</td></tr>
<tr><td class="adc">MCP SCLK</td><td class="lcd n">11</td><td class="n">23</td><td class="n">24</td><td class="lcd">8 (CE0)</td><td class="lcd">LCD CS</td></tr>
<tr><td class="e"></td><td class="iq">GND</td><td class="gnd n">25</td><td class="n">26</td><td>7 (CE1)</td><td class="adc">MCP CS</td></tr>
<tr><td class="i2c">i2C</td><td class="n">0</td><td class="n">27</td><td class="n">28</td><td class="n">1</td><td class="i2c">i2C</td></tr>
<tr><td class="lcd">LCD Reset</td><td class="lcd n">5</td><td class="n">29</td><td class="gnd n">30</td><td>GND</td><td></td></tr>
<tr><td class="lcd">LCD Data</td><td class="lcd n">6</td><td class="n">31</td><td class="n">32</td><td class="n">12</td><td class="rot">Encoder1</td></tr>
<tr><td class="led">LEDs (PWM)</td><td class="n">13</td><td class="n">33</td><td class="gnd n">34</td><td class="iq">GND</td><td></td></tr>
<tr><td class="e"></td><td class="iq n b">19</td><td class="n">35</td><td class="n">36</td><td class="n">16</td><td class="sw">Enc Switch1</td></tr>
<tr><td class="sw">Enc Switch2</td><td class="n">26</td><td class="n">37</td><td class="n">38</td><td class="iq n b">20</td><td></td></tr>
<tr><td class="e"></td><td>GND</td><td class="gnd n">39</td><td class="n">40</td><td class="iq n b">21</td><td></td></tr>
</table>
<table class="pinaux">
<caption>MCP</caption>
<tr><th>MCP</th><th>3.x</th></tr>
<tr><td class="adc n">0</td><td>FS0</td></tr>
<tr><td class="adc n">1</td><td>FS1</td></tr>
<tr><td class="adc n">2</td><td>FS2</td></tr>
<tr><td class="adc n">3</td><td>FS3</td></tr>
<tr><td class="adc n">4</td><td>NavSw</td></tr>
<tr><td class="adc n">5</td><td>Expression</td></tr>
<tr><td class="adc n">6</td><td>VU-Left</td></tr>
<tr><td class="adc n">7</td><td>VU-Right</td></tr>
</table>
</div>

The right-hand table is the MCP3008, and all 8 of its channels are used on v3: four footswitches, the navigation encoder's switch, the expression jack, and the two VU meters that drive the input clipping LEDs. There is no free analog input — a second expression pedal means giving one of these up.

The original sheet also notes `cs0` beside the GPIO 0 / pin 27 row, marking the SPI chip select.

## v2 / Core

<div class="pinout pinout-v2">
<table class="pinkey">
<caption>Key</caption>
<tr><td class="iq">Audio Card</td></tr>
<tr><td class="v5">Power 5v</td></tr>
<tr><td class="v3">Power 3v</td></tr>
<tr><td class="dbnc">Debounce (fsw/encoder)</td></tr>
<tr><td class="i2c">Free GPIO</td></tr>
<tr><td class="adc">MCP</td></tr>
<tr><td class="gnd">Ground</td></tr>
<tr><td class="lcd">SPI LCD</td></tr>
<tr><td class="rot">Nav Encoder</td></tr>
<tr><td class="rly">Relay</td></tr>
</table>
<table class="pinmain">
<caption>pi-Stomp Core Pinout</caption>
<tr><th class="e"></th><th class="e"></th><th>GPIO</th><th>Pin</th><th>Pin</th><th>GPIO</th><th class="e"></th></tr>
<tr><td class="ann"></td><td class="lcd">LCD 3v</td><td class="lcd n">3.3</td><td class="v3 n">1</td><td class="v5 n">2</td><td class="lcd">5v</td><td class="lcd">LCD 5v</td></tr>
<tr><td class="ann"></td><td class="e"></td><td class="iq n b">2</td><td class="n">3</td><td class="v5 n">4</td><td class="iq">5v</td><td></td></tr>
<tr><td class="ann"></td><td class="e"></td><td class="iq n b">3</td><td class="n">5</td><td class="gnd n">6</td><td>GND</td><td></td></tr>
<tr><td class="ann"></td><td class="rot">Nav Encoder</td><td class="n">4</td><td class="n">7</td><td class="n">8</td><td>14 TX</td><td class="midi">UART Midi Out</td></tr>
<tr><td class="ann"></td><td class="e"></td><td class="lcd">GND</td><td class="gnd n">9</td><td class="n">10</td><td>15 RX</td><td class="midi">UART Midi In</td></tr>
<tr><td class="ann"></td><td class="rot">Nav Encoder</td><td class="n">17</td><td class="n">11</td><td class="n">12</td><td class="iq n b">18</td><td></td></tr>
<tr><td class="ann">IQ Enc/SW</td><td class="dbnc b">DB0</td><td class="n">27</td><td class="n">13</td><td class="gnd n">14</td><td>GND</td><td></td></tr>
<tr><td class="ann">IQ Mute</td><td class="dbnc b">DB2</td><td class="n">22</td><td class="n">15</td><td class="n">16</td><td class="n">23</td><td class="dbnc b">DB1</td></tr>
<tr><td class="ann"></td><td class="adc">MCP (+3)</td><td class="iq n b">3.3</td><td class="v3 n">17</td><td class="n">18</td><td class="n">24</td><td class="dbnc b">DB3</td></tr>
<tr><td class="ann"></td><td class="adc">MCP MOSI</td><td class="lcd n">10</td><td class="n">19</td><td class="gnd n">20</td><td>GND</td><td></td></tr>
<tr><td class="ann"></td><td class="adc">MCP MISO</td><td class="n">9</td><td class="n">21</td><td class="n">22</td><td class="n">25</td><td class="dbnc b">DB4</td></tr>
<tr><td class="ann"></td><td class="adc">MCP SCLK</td><td class="lcd n">11</td><td class="n">23</td><td class="n">24</td><td class="lcd">8 (CE0)</td><td class="lcd">LCD CS</td></tr>
<tr><td class="ann"></td><td class="e"></td><td class="iq">GND</td><td class="gnd n">25</td><td class="n">26</td><td class="adc">7 (CE1)</td><td class="adc">MCP CS</td></tr>
<tr><td class="ann"></td><td class="i2c b">GPIO 0</td><td class="n">0</td><td class="n">27</td><td class="n">28</td><td class="rot">1 (Nav)</td><td class="dbnc b">DB5 (Encoder Switch)</td></tr>
<tr><td class="ann"></td><td class="lcd">LCD Reset</td><td class="lcd n">5</td><td class="n">29</td><td class="gnd n">30</td><td>GND</td><td></td></tr>
<tr><td class="ann"></td><td class="lcd">LCD Data</td><td class="lcd n">6</td><td class="n">31</td><td class="n">32</td><td class="n">12</td><td class="rly">Relay Set (PWM)</td></tr>
<tr><td class="ann"></td><td class="i2c b">GPIO 13 (PWM)</td><td class="n">13</td><td class="n">33</td><td class="gnd n">34</td><td class="iq">GND</td><td></td></tr>
<tr><td class="ann"></td><td class="e"></td><td class="iq n b">19</td><td class="n">35</td><td class="n">36</td><td class="n">16</td><td class="rly">Relay Reset</td></tr>
<tr><td class="ann"></td><td class="i2c b">GPIO 26</td><td class="n">26</td><td class="n">37</td><td class="n">38</td><td class="iq n b">20</td><td></td></tr>
<tr><td class="ann"></td><td class="e"></td><td>GND</td><td class="gnd n">39</td><td class="n">40</td><td class="iq n b">21</td><td></td></tr>
</table>
</div>

`DB0`–`DB5` are the debounce network for the footswitches and encoder switches. `IQ Enc/SW` and `IQ Mute` mark where the audio card's own controls land; the original sheet carries them in a column of their own, left of the pin table.

Three differences worth calling out against v3:

| | v2 / Core | v3 |
|---|---|---|
| GPIO 12 and 16 | Relay Set and Relay Reset — a latching true-bypass relay | Encoder1 and Enc Switch1; there is no relay |
| GPIO 13 (PWM) | Free | Drives the addressable LED strip |
| GPIO 0, 26 | Free | i2C expansion and Enc Switch2 |
