---
title: "Automatically Generate Facebook Events"
date: 2024-07-02T12:18:49-04:00
draft: false
---

I live in a house where we run [lots of events](https://akivajackson.com/moho/). I don't love typing in all the details for each event, so I wrote a script to do it for me.

Given that Facebook no longer allows users of the API to [create events](https://stackoverflow.com/a/24499123), I was forced to take a bit of a roundabout route. I was having trouble getting Selenium to work consistently, so I made a simple applescript. To fill out the events. 

This script takes a list of all the event details, delimited by the character "º". I hope it can be helpful to you!

```applescript
set userInput to text returned of (display dialog "Enter data in the format 'Event Name, Start Date, Start Time, End Date, End Time, Location, Details, delimited by º'" default answer "")
set AppleScript's text item delimiters to "º"
set {eventName, startDate, startTime, endDate, endTime, eventLocation, details} to (every text item of eventString)

-- Create a list of the values
set values to {eventName, startDate, startTime, endDate, endTime, eventLocation, details}

-- open the lil end date dropdown 
focusInput("Start time")
delay 0.1
tell application "System Events"
    key code 48 -- Tab to the next field
    delay 0.1
    key code 48 -- Tab to the next field
    delay 0.1
    key code 48 -- Tab to the next field
    delay 0.1
    key code 36 -- enter
end tell

-- open the add location hidden field 
focusInput("End time")
delay 0.3
tell application "System Events"
    key code 48 -- Tab to the next field
    delay 0.1
    key code 48 -- Tab to the next field
    delay 0.1
    key code 48 -- Tab to the next field
    delay 0.1
    key code 48 -- Tab to the next field
    delay 0.1
    key code 36 -- enter
    delay 0.1
    key code 125 -- down arrow
    delay 0.1
    key code 36 -- enter
end tell

-- Iterate over the labels and values together to fill out the form
repeat with i from 1 to count labels
    -- Call setInputValue for each pair of label and value
    setInputValue(item i of labels, item i of values)
end repeat
```