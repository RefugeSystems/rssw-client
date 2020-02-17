# Current
+ Refine History List with a sortable/searchable table

# Properties
√ Flag to nullify item stat inheritance (For Bags)  
        + This should remove the need for inventory types and they'll simply be items
+ [STARTED] History / Log 
		√ Solve when to update history as all will trigger from other clients in "auto" mode
				! Create new serverside class for entities
				+ New class handles checking for tracked keys during updates and adding history
				+ History gets updated and synced back with the modify response as needed
		√ For list differences, finish counting by ID to determine new
        √ Use current time
        √ Location Changes
        √ XP Changes
        + Archetype Changes
        √ Stat Changes
        + Damage Changes

# Bugs
√ Paged Table  
        + Doesn't properly follow current filter at load
        + When changing data sources and beyond the highest page, doesn't backtrack well
        + Changing data source seems problematic in general with regard to page
+ Info "Back" button needs to rewind base and target as well as record

# Data
+ Archetype Field Set

# UIs
+ Shop Interface
√ Bag Info Display
√ Ship Display  
        + Passenger Manifest  
                + Entities with "Inside" that entity set
                + May need a helper function to index this changing for speed purposes, but not likely
√ Update Location output with contained entities  
        + Including Sublocations and Entities in those locations
        + Entities sitting in entities can be skipped
√ History Display  
        + Widget for entity
√ Master set location control  
        + Under location - Set location for a party
        + From the galaxy, add locations to target list and allow entities to have location set
√ Galaxy add location column (For location name)  
        + Possibly limited to entity & location types
√ Knowledge table widget for entities to list knowledge
		+ Only updates when the entity updates and the length of knowledge differs from the current cache
		+ Should cache a translation of the knowledge array for the table to index and sort nicely
		+ Self contained description display to allow multiple knowledges to be viewed at once
+ Info comparison state to "store" the current record for comparison that can be closed from a side-by-side view
		+ Give a "DIFF" for any calculated fields?
√ Clicking on a skill in character view sets it up for leveling
		+ This will involve $emit & v-on
		+ Clicking it while it is set for leveling opens info
		+ An info icon appears next to the selected skill for leveling
√ Add custom skills to skill area widget for entities
+ Need UI for controling Entity widgets for display (Simple list, stores to entity)
+ Roll Dice
		+ Universe needs a way to specify its available dice configurations
		+ Roller needs to be able to select from the available dice configurations
+ Historical note taking Widget at a player level, maybe save to player itself
		+ Has a "current" note
		+ Has a scrolling collapsable list of previous notes
		+ Clicking previous notes opens info tab
		+ Clicking the "edit" on a previous note moves it to "current"
		+ Notes sort by name only with a toggable direction
		+ Listing has a filter that searches the `_search` key for deeper information

# Functions
+ Restock Shop
+ Self check-out from shop view once created
√ Equip item to an item  
		+ This should always require the item to be send takes a slot
		+ Additionally the receiving item should have a free slot, but this should be a report on the display for now
+ Give room to entity
+ Universe Time
√ Limit "Give" list of entities to current party AND entities that also have "inside" the same as the current source entity
+ Display calculated "Dice" results more standardly through the calculator class

# Tweaks	
√ Galaxy
        + Sort Targets by name ignoring case
        + Sort types by name
√ In basic info, clean up "Skill Check" display
