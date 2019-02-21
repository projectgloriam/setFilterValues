# setFilterValues
This SharePoint Jquery plugin automatically updates new items from the consumer list to a provider list field's value.

In simple English, whenever you add new items to a list table (consumer) inside another list's form (provider), the new items' field value becomes the provider's item name (or title).


## To use this plugin

```
<script type="text/javascript" src="jquery.js"></script>` 

<script type="text/javascript" src="setFilterValues.js"></script>
```

`````````
$("table[summary*='CONSUMER LIST NAME']").updateFilter({

  providerList: "Provider", //Provider List Name

  providerField: "Provider Title", //Provider List Field
  
  consumerField: "Consumer field that connects to the provider's title" //Consumer List Field

});

`````````
