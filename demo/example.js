

// some sample json data
var sampledata = [
{
    id: 1,
    content: 'content',
    children: [
    {
        id: 2,
        content: 'content',
        children: []
    },
    {
        id: 3,
        content: 'content',
        children: [],
        isAllowed: false
    }
    ]
},
{
    id: 4,
    content: 'content',
    children: []
},
{
    id: 5,
    content: 'content',
    children: [
    {
        id: 6,
        content: 'content',
        children: [],
        isAllowed: false
    },
    {
        id: 7,
        content: 'content',
        children: [
        {
            id: 8,
            content: 'content',
            children: []            
        }
        ]
    }
    ]
},
]


$().ready(function(){
    var ns = $('ol.sortable').nestedSortable({
        forcePlaceholderSize: true,
        handle: 'div',
        helper: 'clone',
        items: 'li',
        opacity: .6,
        placeholder: 'placeholder',
        revert: 250,
        tabSize: 25,
        tolerance: 'pointer',
        toleranceElement: '> div',
        maxLevels: 4,
        isTree: true,
        expandOnHover: 700,
        startCollapsed: false,
        isAllowed: function(placeholder, placeholderParent, currentItem) {
            return placeholderParent.attr('data-isallowed') === 'true';
        },
        change: function(){
            console.log('Relocated item');
        }
    });
    

    // generate html from sample json data
    createHtmlFromJson($('ol.sortable-new'), sampledata);

    function createHtmlFromJson(elm, data) {
        data = data || [];
        elm.empty();

        data.forEach(function(d, i) {
            var $li = $('<li class="mjs-nestedSortable-branch mjs-nestedSortable-expanded">')
                .attr('id', 'menuItem_'+d.id)
                .attr('data-isallowed', typeof d.isAllowed === 'undefined' || d.isAllowed)
            var $div = $('<div class="menuDiv">').attr('data-id', d.id);
            var $disclose = $('<span class="disclose ui-icon">')
                .attr('title', 'Click to show/hide children')
                .addClass(typeof d.isAllowed === 'undefined' || d.isAllowed ? 'ui-icon-minusthick': 'ui-icon-document')

            var $content = $('<div class="item-content">').text(d.content + ' ' + d.id)
            var $menuIcon = $('<span class="menu-icon ui-icon ui-icon-gear">')
            $div.append($disclose).append($content).append($menuIcon)
            $li.append($div)

            // recursively add children
            if (d.children && d.children.length) {
                var $ol = $('<ol>')
                createHtmlFromJson($ol, d.children)
                $li.append($ol)
            }

            elm.append($li)
        })
    }


    $('.expandEditor').attr('title','Click to show/hide item editor');
    $('.disclose').attr('title','Click to show/hide children');
    $('.deleteMenu').attr('title', 'Click to delete item.');

    $('.disclose').on('click', function() {
        $(this).closest('li').toggleClass('mjs-nestedSortable-collapsed').toggleClass('mjs-nestedSortable-expanded');
        $(this).toggleClass('ui-icon-plusthick').toggleClass('ui-icon-minusthick');
    });
    
    // $('.expandEditor, .itemTitle').click(function(){
    //     var id = $(this).attr('data-id');
    //     $('#menuEdit'+id).toggle();
    //     $(this).toggleClass('ui-icon-triangle-1-n').toggleClass('ui-icon-triangle-1-s');
    // });
    
    // $('.deleteMenu').click(function(){
    //     var id = $(this).attr('data-id');
    //     $('#menuItem_'+id).remove();
    // });
        
    // $('#serialize').click(function(){
    //     serialized = $('ol.sortable').nestedSortable('serialize');
    //     $('#serializeOutput').text(serialized+'\n\n');
    // })

    // $('#toHierarchy').click(function(e){
    //     hiered = $('ol.sortable').nestedSortable('toHierarchy', {startDepthCount: 0});
    //     hiered = dump(hiered);
    //     (typeof($('#toHierarchyOutput')[0].textContent) != 'undefined') ?
    //     $('#toHierarchyOutput')[0].textContent = hiered : $('#toHierarchyOutput')[0].innerText = hiered;
    // })

    // $('#toArray').click(function(e){
    //     arraied = $('ol.sortable').nestedSortable('toArray', {startDepthCount: 0});
    //     arraied = dump(arraied);
    //     (typeof($('#toArrayOutput')[0].textContent) != 'undefined') ?
    //     $('#toArrayOutput')[0].textContent = arraied : $('#toArrayOutput')[0].innerText = arraied;
    // });
});         

function dump(arr,level) {
    var dumped_text = "";
    if(!level) level = 0;

    //The padding given at the beginning of the line.
    var level_padding = "";
    for(var j=0;j<level+1;j++) level_padding += "    ";

    if(typeof(arr) == 'object') { //Array/Hashes/Objects
        for(var item in arr) {
            var value = arr[item];

            if(typeof(value) == 'object') { //If it is an array,
                dumped_text += level_padding + "'" + item + "' ...\n";
                dumped_text += dump(value,level+1);
            } else {
                dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
            }
        }
    } else { //Strings/Chars/Numbers etc.
        dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
    }
    return dumped_text;
}
