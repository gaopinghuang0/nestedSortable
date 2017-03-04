

// some sample json data
// all the keys should be in lowercase
// because after output to json, keys are stored as lowercase
var sampledata = [
{id: 0,
content: "root protected",
is_root: true,
children: [
    {
        id: 1,
        content: 'content 1',
        children: [
        {
            id: 2,
            content: 'content 2',
            children: []
        },
        {
            id: 3,
            content: 'content 3',
            children: [],
            is_allowed: false
        }
        ]
    },
    {
        id: 4,
        content: 'content 4',
        children: []
    },
    {
        id: 5,
        content: 'content 5',
        children: [
        {
            id: 6,
            content: 'content 6',
            children: [],
            is_allowed: false
        },
        {
            id: 7,
            content: 'content 7',
            children: [
            {
                id: 8,
                content: 'content 8',
                children: []            
            }
            ]
        }
        ]
    },
    ]
    }
]


$().ready(function(){
    'use strict';

    var $ol = $('ol.sortable')

    var ns = $ol.nestedSortable({
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
        protectRoot: true,
        startCollapsed: false,
        isAllowed: function(placeholder, placeholderParent, currentItem) {
            if (!placeholderParent) return true;
            return placeholderParent.attr('data-is_allowed') === 'true';
        },
        change: function(){
            console.log('Relocated item');
        }
    });
    

    // generate html from sample json data
    createHtmlFromJson($ol, sampledata);

    function createHtmlFromJson(elm, data) {
        data = data || [];
        elm.empty();

        data.forEach(function(d, i) {
            var $li = $('<li class="mjs-nestedSortable-branch mjs-nestedSortable-expanded">')
                .attr('id', 'menuItem_'+d.id)
                .attr('data-is_allowed', typeof d.is_allowed === 'undefined' || d.is_allowed)
            if (d.is_root) {
                $li.attr('data-is_root', true);
            }
            var $div = $('<div class="menuDiv">').attr('data-id', d.id);

            var $addon;
            if (typeof d.is_allowed === 'undefined' || d.is_allowed) {
                $addon = $('<span class="disclose glyphicon glyphicon-chevron-down">')
                    .attr('title', 'Click to show/hide children')
            } else {
                $addon = $('<span class="document glyphicon glyphicon-picture">')
            }

            var $content = $('<div class="item-content">').text(d.content)
            var $menuIcon = $('<span class="menu-icon glyphicon glyphicon-option-vertical">')
            $div.append($addon).append($content).append($menuIcon)
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



    // $('.expandEditor').attr('title','Click to show/hide item editor');
    // $('.disclose').attr('title','Click to show/hide children');
    // $('.deleteMenu').attr('title', 'Click to delete item.');

    // ensure it works after the list is redrawn
    $ol.on('click', '.disclose', function() {
        $(this).closest('li').toggleClass('mjs-nestedSortable-collapsed').toggleClass('mjs-nestedSortable-expanded');
        $(this).toggleClass('glyphicon-chevron-right').toggleClass('glyphicon-chevron-down');
    });

    $('.add-item').on('click', function() {
        var content = $('.item-input').val();
        $('.item-input').val('');
        var isAllowed = $('.isallowed-checkbox').prop('checked')
        
        var data = getHierarchyData();
        data[0].children.push({
            id:  $('.menuDiv').length + 1,
            content: content,
            is_allowed: isAllowed,
            children: []
        })
        // redraw
        createHtmlFromJson($ol, data);
    })
    
    // $('.expandEditor, .itemTitle').click(function(){
    //     var id = $(this).attr('data-id');
    //     $('#menuEdit'+id).toggle();
    //     $(this).toggleClass('ui-icon-triangle-1-n').toggleClass('ui-icon-triangle-1-s');
    // });
    
    // $('.deleteMenu').click(function(){
    //     var id = $(this).attr('data-id');
    //     $('#menuItem_'+id).remove();
    // });
        
    $('#serialize').click(function(){
        var serialized = $ol.nestedSortable('serialize');
        $('#serializeOutput').text(serialized+'\n\n');
    })

    $('#toHierarchy').click(function(e){
        var hiered = getHierarchyData();
        hiered = JSON.stringify(hiered, null, 2);
        $('#toHierarchyOutput').text(hiered);
    })

    function getHierarchyData() {
        return $ol.nestedSortable('toHierarchy', {startDepthCount: 0, includeContent: true});
    }


    $('#toArray').click(function(e){
        var arraied = $ol.nestedSortable('toArray', {startDepthCount: 0});
        arraied = dump(arraied);
        (typeof($('#toArrayOutput')[0].textContent) != 'undefined') ?
        $('#toArrayOutput')[0].textContent = arraied : $('#toArrayOutput')[0].innerText = arraied;
    });
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
