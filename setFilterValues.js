//To use this plugin, 
//$("table[summary*='CONSUMER LIST NAME']").updateFilter({
//...options...
//});
(function( $ ) {
    $.fn.setFilterValues = function( options ) {

        //default options.
        var settings = $.extend({
            providerList: '', //Provider List Name
            providerField: '', //Provider List Field
            consumerField: '' //Consumer List Field
        }, options );

        //Get URL address of SharePoint site
        var siteUrl = $(location).attr("href").split("/", 5).join("/");

        //Incase the provider List name is not set, set it the provider list name.
        if(settings.providerList==''){
          settings.providerList=$(document).attr("title").split(" - ",1).join();
        }

        //provider list field
        var providerValue = $(".ms-standardheader:contains('"+settings.providerField+"')").parent().next().text();

        //consumer list name
        var consumerList = $(this).attr("summary");

        var consumerListIDs = {};

        //Get IDs of items
        function currentIdList(){
          var results = [];

          $("tr[iid]").each(function(index){
            //Using regex to fetch id between commas
            results.push($(this).attr('iid').match(/,(.*),/).pop());
          });

          return results;
        }

        //Updates an item
        function updateItem(value) {
          var clientContext = new SP.ClientContext(siteUrl);

          var oList = clientContext.get_web().get_lists().getByTitle(consumerList);

          this.oListItem = oList.getItemById(value);

          oListItem.set_item(settings.consumerField, settings.providerList);

          oListItem.update();

          clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
        }

        //Update success message
        function onQuerySucceeded() {
            console.log('Item updated!');
        }

        //Update failure message
        function onQueryFailed(sender, args) {
            console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        }

        //gets difference between two arrays
        function diff(a,b){
          var difference;
          $.grep(b, function(el) {
              if (jQuery.inArray(el, a) == -1) difference.push(el);
          });

          return difference;
        }

        //Updates new items if they are detected:
        //It fetches the current items' ID from the consumer list.
        //If the current items' id list is greater than previous items' id list, 
        //it fetches the new items 
        //and update each item
        function updateList(){
          consumerListIDs.last=currentIdList();


          var newItems = [];

          if(consumerListIDs.last > consumerListIDs.first) {
            newItems = diff(consumerListIDs.first,consumerListIDs.last);

            $.each( newItems, function( key, value ) {
              updateItem(value);
            });
          }
        }

        //Adding a function to 'edit list' button. Function creates an array of consumer list IDs.  
        $(this).siblings("table").find("a[title*='Edit this list using Quick Edit mode.']").attr("onclick", function() { 
          return "consumerListIDs.first = currentIdList(); " + $(this).attr("onclick");
        });

        //Adding a function to 'Stop...' button. Function updates new items to provider value
        $(this).siblings("table").find("a[title*='Stop editing and save changes.']").attr("onclick", function() { 
          return " updateList(); " + $(this).attr("onclick");
        });

    };
 
}( jQuery ));