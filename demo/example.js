

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
                $addon = $('<span class="document glyphicon glyphicon-file">')
            }

            var $content = $('<div class="item-content">').text(d.content)
            var $menuIcon = $('<span class="menu-popover glyphicon glyphicon-option-vertical">')
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

    // ensure it works after the list is redrawn
    $ol.on('click', '.disclose', function() {
        $(this).closest('li').toggleClass('mjs-nestedSortable-collapsed').toggleClass('mjs-nestedSortable-expanded');
        $(this).toggleClass('glyphicon-chevron-right').toggleClass('glyphicon-chevron-down');
    });


    // popover
    // credit: http://stackoverflow.com/questions/16150163/show-one-popover-and-hide-other-popovers
    // Credit: http://stackoverflow.com/a/25252552/4246348
    var currMenuId = null;
    $('body').popover({
        selector: '.menu-popover',
        content: $('#popover-content').html(),
        trigger: "click",
        html: true
    }).on("show.bs.popover", function(e){
        // set id to content
        currMenuId = $(e.target).closest('.menuDiv').attr('data-id')
        // show menu accordingly
        setTimeout(function() {
            var shouldShowAddRoot = $('#menuItem_'+currMenuId).attr('data-is_root') === 'true';
            $('.insert-root').toggle(shouldShowAddRoot);
        })
        // hide all other popovers
        $(".menu-popover").not(e.target).popover("destroy");
        $(".popover").remove();                    
    });

    // hide when click outside or click on menu item
    $('body').on('click', function (e) {
        if (!$(e.target).attr('class')
            || $(e.target).attr('class').indexOf('menu-popover') === -1) { 
            // NOTE: must use destroy, instead of hide,
            // otherwise, the next click will not popup
            $('.menu-popover').popover('destroy');
        }
    })

    $ol.on('click', '.edit-item', function(e) {
        enableEditById(currMenuId);
    })    

    $ol.on('click', '.delete-menu', function() {
        $('#menuItem_'+currMenuId).remove();
    })

    $ol.on('click', '.insert-root', function() {
        insertElement('root')
    })

    $ol.on('click', '.insert-folder', function() {
        insertElement('folder')
    })

    $ol.on('click', '.insert-document', function() {
        insertElement('document')
    })

    function insertElement(type) {
        var elm = $('#menuItem_'+currMenuId);
        var _data = [{
            id:  $('.menuDiv').length + 1,
            content: 'new ' + type,
            children: []
        }]
        var _item = _data[0];
        if (type === 'root') {
            // append to the very end
            var data = getHierarchyData();
            _item.is_root = true;
            data.push(_item)
            createHtmlFromJson($ol, data);
        } else {
            _item.is_allowed = (type!=='document');
            var _list = $('<ol>')
            createHtmlFromJson(_list, _data)
            if (elm.attr('data-is_allowed') === 'true') {
                // append inside
                _list.appendTo(elm)
            } else {
                // append after
                _list.children().insertAfter(elm)
            }
        }

        // enable editing immediately
        enableEditById(_item.id)
    }


    function enableEditById(id) {
        var obj = $('#menuItem_'+id).find('.item-content').first()
        // using X-editable
        obj.editable({
            type: 'text',
            toggle:'manual',
            // mode: 'inline',
            success: function(response, newValue) {
                // obj.editable('disabled')
                console.log(newValue) //update backbone model
            }
        });
        obj.editable('show')               
    };

    function getHierarchyData() {
        return $ol.nestedSortable('toHierarchy', {startDepthCount: 0, includeContent: true, contentTarget: '.item-content'});
    }

    $('#serialize').click(function(){
        var serialized = $ol.nestedSortable('serialize');
        $('#serializeOutput').text(serialized+'\n\n');
    })

    $('#toHierarchy').click(function(e){
        var hiered = getHierarchyData();
        hiered = JSON.stringify(hiered, null, 2);
        $('#toHierarchyOutput').text(hiered);
    })

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
