# Sentiment color management

This document consists of requirements for functionality implemented within epic [[Tasks/User Story: [Epic] Sentiment color management#^7a8452d0-8558-11ea-8035-51799a2fd608/5db5dd80-f3b6-11ec-a1ad-bb3e1a1750cd]]

The main idea is to create a tool to manage sentiment and their colors for bivariate layers. Currently, we apply them manually via DB but don't have a full picture is this works good or bad.

A glossary with terms is here [[Tasks/project: Bivariate Manager#^131cd711-3bb4-11e9-9428-04d77e8d50cb/c4a79070-96cd-11eb-83ce-250e9b944601]] 

Design with notes is here: <https://www.figma.com/file/oZnERMABuwJdO0pjZmj9qS/Bivariate-manager?node-id=4689%3A96160> 

The interface for managing colors is available for authorized users who have access to beta feature (assigned in user profile service) - 'bivariate-color-manager'. It consists of the following forms.

### List of sentiments

View list of sentiments
* number of layers assigned to sentiments
* number of legend with this sentiment (+ number of not defined colors for legend)

Filter sentiment by layers \[indicator\]

Create new sentiment (only name)

### Color legends

View list of sentiment combinations

View sublist of nested indicators for each sentiment

Filter by:
* color combinations
* indicator
* not defined legends

View bivariate legend

Change colors for corners of bivariate legend

View bivariate map 

### List of indicators (layers)

View list of indicators
* name
* is_base
* assigned sentiments

Filter indicators by sentiments

Filter indicators by not defined (?legend/sentiment)

View full info about indicator 
