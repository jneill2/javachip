const radioChecked = 'radio_button_checked';
const radioUnchecked = 'radio_button_unchecked';
const play_button = 'play_circle_outline';
const pause_button = 'pause_circle_outline';
// function practice(x) {
//     return layout(x, 'feedback');
// }
// function quiz(x) {
//     return layout(x, 'no-feedback');
// }
function javachip(x, feedback) {
    let y = 'feedback';
    if (feedback == false) {
        y = 'no-feedback';
    }
    return layout(x, y)
}
function layout(x, c) {
    // var x = jQuery.extend(true, {}, data);
    // console.log(x,data)
    let header = create_header(x);
    let sections = create_sections(x)
    let container = document.createElement('div');
    container.className = c;
    let button = create_finishButton(container);
    $(sections).append(button);
    $(container).append(header, sections);
    return container;
};
$(window).on('keydown', function(evt) {
    if (evt.key == 'Enter') {
        evt.preventDefault();
        // console.log(evt)
        if ($(evt.target).next('blank').length > 0) {
            $(evt.target).next('blank').focus();
        } else if (evt.target.parentElement.tagName == 'LI') {
            if ($(evt.target).closest('li').next().find('blank')[0]) {
                $(evt.target).closest('li').next().find('blank')[0].focus();
            }
        } else if (evt.target.parentElement.tagName == 'TD') {
            // console.log(evt.target.offsetParent.cellIndex)
            let col = evt.target.offsetParent.cellIndex;
            // console.log($(evt.target).closest('TR').next().find('td')[col])
            if ($(evt.target).closest('TR').next().find('td')[col]) {
                let td = $(evt.target).closest('TR').next().find('td')[col]
                $(td).find('blank')[0].focus();
            } else if ($(evt.target).closest('TABLE').first('tr').find('blank') == true) {
                let first_row = $(evt.target).closest('TABLE').find('tr')[0];
                let nxt  = $(first_row).find('td')[col+1];
                if (nxt) {
                    $(nxt).find('blank')[0].focus();
                }
            } else if ($(evt.target).closest('TABLE').find('tr')[1]) {
                let sec_row = $(evt.target).closest('TABLE').find('tr')[1];
                let nxt  = $(sec_row).find('td')[col+1];
                if (nxt) {
                    $(nxt).find('blank')[0].focus();
                }
            }
        } else {
            if ($(evt.target).closest('section').next().find('blank')[0]) {
                $(evt.target).closest('section').next().find('blank')[0].focus();
            }
        }
    }
});
/* 
    * Functions for compiling the html
    * 
*/
function create_header(sheet) {
    let page_title = document.createElement('h1');
    if (sheet.title) {
        page_title.innerHTML = sheet.title;
    } else {
        page_title = undefined;
    }
    let restore_page = document.createElement('restore_page');
    $(restore_page).html('restore_page').addClass('material-icons');
    $(restore_page).click(function() {
        $(page_title).parent().animate({opacity:0.1}, 5).animate({opacity:1},400)
        for (re_item in sheet.sections) {
            reload_section(sheet.sections[re_item].main.content, re_item)
        }
    })
    page_title.appendChild(restore_page);
    return page_title;
}
function create_sections(sheet) {
    let sections = document.createElement('div');
    for (item in sheet.sections) {
        let heading_el = document.createElement('heading');
        let num = Number(item)+1;
            heading_el.innerHTML = num + '. ' + sheet.sections[item].title;
        let section_el = document.createElement('section');
        let comment_el = document.createElement('comment');
        let content_el = document.createElement('content');
        let postscript_el = document.createElement('postscript');
        let prologue_el = document.createElement('prologue');
        let main_content = sheet.sections[item].main.content;
        let main_class = sheet.sections[item].main.class;
        let answer = document.createElement('answer');
        if (sheet.sections[item].comment) {
            comment_el.innerHTML = sheet.sections[item].comment;
        } else {
            comment_el = undefined;
        }
        if (sheet.sections[item].class) {
            section_el.className = sheet.sections[item].class;
        }
        if (sheet.sections[item].main.prologue) {
            $(prologue_el).append(sheet.sections[item].main.prologue);
            content_el.appendChild(prologue_el);
        }
        // create_content(sheet, item);
        if (typeof main_content === 'function') {
            // let cc = () => {return main_content();}
            try {
                content_el.appendChild( main_content() );
            } catch(err) {
                content_el.innerHTML = (err.message)
            }
        } else {
            try {
                content_el.appendChild(main_content);
            } catch(err) {
                content_el.innerHTML = (err.message)
            }
        }
        if (main_class) {
            content_el.className = main_class;
        }
        answer.innerHTML = content_el.innerHTML;
        dnd_able(content_el);
        if (sheet.sections[item].main.postscript) {
            postscript_el.innerHTML = sheet.sections[item].main.postscript;
            content_el.appendChild(postscript_el);
        }
        let re_item = item;
        let refresh = document.createElement('refresh')
        $(refresh).html('refresh').addClass('material-icons')
        $(refresh).click(function() {
            reload_section(sheet.sections[re_item].main.content, re_item);
            // $(this).parent().find('blank')
            // let re_con = create_content(sheet, re_item);
            // console.log(re_con)
        })
        $(section_el).append(refresh, heading_el, comment_el, content_el, answer);
        $(sections).append(section_el);
    }
    return sections;
}
function create_finishButton(container) {
    let button = document.createElement('button');
    button.className = 'finish-button';
    button.innerText = 'Finish';
    $(button).click(function() {
        $(container).animate({opacity:0.1}, 5).animate({opacity:1},400)
        $(container).parent()[0].scrollIntoView();
        window.scrollTo(0, 0);
        container.className = 'feedback locked';
        $(container).find('answer [answer]').each(function() {
            let str = $(this).attr('answer');
            let txt = str.split(/&&|\|\|/g)[0];
            // txt = txt.trim().split(' ');
            // txt = txt.toString().replace(/&nbsp;/g, ' ');
            $(this).text(txt)
        })
    })
    return button;
}
// function create_content(sheet, item) {
//     // let content_el = document.createElement('content');
//     let main_content = sheet.sections[item].main.content;
//     if (typeof main_content === 'function') {
//         try {
//             content_el.appendChild(main_content());
//         } catch(err) {
//             content_el.innerHTML = (err.message)
//         }
//     } else {
//         try {
//             content_el.appendChild(main_content);
//         } catch(err) {
//             content_el.innerHTML = (err.message)
//         }
//     }
//     dnd_able(content_el, item);
//     return content_el
// }
function reload_section(container) {
    $(container).animate({opacity:0.1}, 5).animate({opacity:1},400);
    // $(container).animate({opacity:1},400)
    if (document.getElementsByClassName('locked')[0]){document.getElementsByClassName('locked')[0].className = 'no-feedback';}
    $(container).closest('section').removeClass('completed');
    $(container).find('blank').each(function () {
        $(this).html('').removeClass('correct').removeClass('incorrect');
    });
    $(container).find('select').each(function () {
        $(this).val('').removeClass('correct').removeClass('incorrect');
    });
    $(container).find('box').each(function () {
        $(this).html(radioUnchecked).removeClass('correct').removeClass('incorrect');
        
    });
    $(container).find('lex').each(function () {
        $(this).removeClass('correct').removeClass('incorrect');

    });
    $(container).each(function() {
        let arr = [];
        for (i = 0; i < $(container).find('checkbox').length; i++) {
            arr.push($(container).find('checkbox')[i]);
        }
        $(this).append(randomizeArray(arr));
    })
    $(container).each(function() {
        let arr = [];
        for (i = 0; i < $(this).find('li').length; i++) {
            arr.push($(container).find('li')[i])
        }
        $(this).find('ol.shuffle, ul.shuffle').append(randomizeArray(arr))
    })
    if ($(container).hasClass('type') && $(container).find('wordbank').length > 0) {
        $(container).parent().find('wordbank').remove();
        wordbank(container);
    }
    if ($(container).hasClass('drop')) {
        $(container).find('wordbank').remove();
        wordbank(container);
        dnd_able(container.parentElement)
    }
    $(container).closest('section').find('answer').html( container.outerHTML );
}
/* 
    These functions can be called by the user independently or in a practice sheet/quiz
    * click(x) where x is a string or an array. Clickable words are enclosed with {{brackets}}.
    * selector(x) where x is a string or an array. Selectable words are enclosed with {{brackets}}.
    * checkbox(x) and choose(x) where x is an array in which the correct answer is given as {correct:'The right answer'}
    * type(x) where x is a string or an array. Typeable words are enclosed with {{brackets}}.
    * dragon(x) where x is a string or an array. Draggable words are enclosed with {{brackets}} and are placed in a wordbank.
    * table(x) where x is an array. The table is typeable by default.
    * The word `dragon` can be used as the second aug in the main table() function to create a drag-and-drop
    * The word `wordbank` can be used as the second aug in the main table() or type() function to create a wordbank for the typeable words.
*/
function audio(src, txt) {
    let container = document.createElement('div');
        container.className = 'audio-container'
    let monitor = document.createElement('monitor');
    let bar = document.createElement('bar');
    let ball = document.createElement('ball');
        $(monitor).append(bar, ball);
    let playIcon = document.createElement('span');
        playIcon.className = 'player material-icons';
        playIcon.innerHTML = play_button;
    let note = document.createElement('note');
    if (txt) note.innerHTML = txt;
    let audio = document.createElement('audio');
        audio.setAttribute('src',src);
    playIcon.addEventListener('click', function() {
        play_pause(container, monitor, audio);
    })
    soundBar(container, monitor, audio);
    $(container).append(playIcon, monitor, audio, note);
    return container
}
function click(prop) {
    let string = prop.trim();
    string = string.split(' ');
    let wordclick = document.createElement('wordclick');
    for (word in string) {
        let lex = document.createElement('lex');
        if (string[word].slice(0,2) == '{{' && string[word].slice(-2) == '}}') {
            let answer = string[word].slice(2,-2);
            // answer_arr.push(answer);
            lex.innerHTML = answer;
            lex.setAttribute('answer', '');
            $(wordclick).append(lex);
        } else {
            lex.innerHTML = string[word];
            $(wordclick).append(lex, '&#8203;');
        }
        $(lex).click(function() {
            if (this.hasAttribute('answer')) {
                if (this.className == 'correct') {
                    $(this).removeClass('correct');
                } else {
                    $(this).addClass('correct');
                }
            } else {
                if (this.className == 'incorrect') {
                    $(this).removeClass('incorrect');
                } else {
                    $(this).addClass('incorrect');
                }
            }
            check_section($(this).closest('section'));
        })
    }
    return wordclick;
}
function selector(prop, options) {
    let content = blankify(prop);
    let container = document.createElement('div');
    container.appendChild(content);
    let select = document.createElement('select');
    let opt_arr = [];
    if (options.length > 0) {
        for (option in options) {
            opt_arr.push(options[option]);
        }
    } else {
        $(container).find('[answer]').each(function() {
            let option = $(this).attr('answer');
            if (opt_arr.indexOf(option) == -1) {
                opt_arr.push(option);
            }
        })
        opt_arr = randomizeArray(opt_arr);
    }
    opt_arr.unshift('');
    for (opt in opt_arr) {
        let option = document.createElement('option');
        $(option).text(opt_arr[opt]);
        $(option).attr('value',opt_arr[opt]);
        $(select).append(option);
    }
    $(select).on('change', function() {
        $(this).removeClass('correct , incorrect');
        let answer = $(this).next('[answer]').attr('answer').split(' || ');
        // let isgood = $(this).val() == $(this).next('[answer]').attr('answer');
        let isgood = answer.indexOf($(this).val()) != -1;
        if (isgood == true) {
            $(this).addClass('correct');
        } else if (isgood == false && $(this).val().length > 0) {
            $(this).addClass('incorrect');
        }
        check_section($(this).closest('section'));
    })
    $(container).find('blank').before(select);
    $(container).addClass('selector');
    return container;
}
function choose(prop) {
    return checkbox(prop, 'choose');
}
function checkbox(prop, isChoose) {
    let div = document.createElement('div');
    let chbox_arr = [];
    for (x in prop) {
        chbox_arr.push(prop[x]);
    }
    chbox_arr = randomizeArray(chbox_arr);
    for (x in chbox_arr) {
        let box = document.createElement('box');
        box.className = 'material-icons'
        box.innerHTML = radioUnchecked;
        let checkbox_el = document.createElement('checkbox');
        if (typeof chbox_arr[x] == 'string') {
            checkbox_el.innerText = chbox_arr[x];
        } else {
            checkbox_el.innerText = chbox_arr[x].correct;
            $(box).attr('answer', '');
        }
        $(box).on('click', function() {
            if (isChoose == 'choose') {
                $(this).parent().parent().find('box').removeClass('correct').html(radioUnchecked);
                $(this).parent().parent().find('box').removeClass('incorrect').html(radioUnchecked);
            }
            if ($(this).hasClass('incorrect') || $(this).hasClass('correct')) {
                $(this).removeClass('correct');
                $(this).removeClass('incorrect');
                $(this).text(radioUnchecked);
            } else {
                $(this).text(radioChecked);
                if (this.hasAttribute('answer')) {
                    $(this).addClass('correct');
                } else {
                    $(this).addClass('incorrect');
                }
            }
            check_section($(this).closest('section'));
        });
        $(checkbox_el).prepend(box);
        div.appendChild(checkbox_el);
    }
    return div;
}
function table(prop, _command) {
    let tb = document.createElement('table');
    if (prop.header) {
        if (prop.header.length >! prop.data[0].length) {
            prop.header.unshift('');
        }
        let first_row = document.createElement('tr');
        for (col in prop.header) {
            let td = document.createElement('th');
            td.innerHTML = prop.header[col]
            first_row.appendChild(td);
        }
        tb.appendChild(first_row)
    } else {

    }
    for (row in prop.data) {
        let tr = document.createElement('tr');
        for (col in prop.data[row]) {
            let td = document.createElement('td');
            if (col == 0) {
                let first_td = document.createElement('td');
                first_td.innerHTML = prop.first[row];
                tr.appendChild(first_td);
            }
            if (col == 0 && prop.second) {
                let sec_td = document.createElement('td');
                sec_td.innerHTML = prop.second[row];
                tr.appendChild(sec_td);
            }
            let cell_answer = prop.data[row][col];
            let blank = document.createElement('blank');
            blank.setAttribute('answer', cell_answer);
            td.appendChild(blank);
            tr.appendChild(td);
        }
        tb.appendChild(tr);
    }
    let container = document.createElement('div');
    container.appendChild(tb);
    // make_typeable(container);
    if (_command == dragon) {
        dnd(container);
    } else if (_command === wordbank) {
        make_typeable(container);
        wordbank(container);
    } else {
        make_typeable(container);
    }
    return container;
}
function type(prop, _command) {
    let content = blankify(prop);
    let container = document.createElement('div');
    container.appendChild(content);
    make_typeable(container);
    if (_command) {
        if (typeof _command === 'function') {
            _command(container);
        } else {
            console.log('make wordbank from array')
        }
    }
    console.log(container)
    return container;
}
function dragon(prop, shuffle) {
    let text;
    if (prop.text) {
        text = prop.text;
    } else {
        text = prop;
    }
    let content = blankify(text, shuffle);
    let container = document.createElement('div');
    let rates;
    let rateButtons;
    if (prop.rates) {
        rates = (prop.rates);
        rateButtons = document.createElement('div');
        rateButtons.className = 'cloze-rates';
        for (item in rates) {
            let button = document.createElement('button');
            let r = rates[item]
            button.innerHTML = 'cloze ('+r+')';
            button.addEventListener('click', function() {
                $(container).find('wordbank').remove()
                $(container).find('text').remove()
                // dnd_able(container.parentElement);
                let t = cloze(prop.original, [r]);
                let b = blankify(t.text);
                $(container).append(b);
                reload_section(container);
                // dnd(container);
                // dnd_able(container);
            })
            rateButtons.appendChild(button);
        }
        container.appendChild(rateButtons);
    }
    container.appendChild(content);
    return dnd(container)
}
function cloze(prop, rates) {
    Array.max = function( array ){
        return Math.max.apply( Math, array );
    };
    let maxRate = Array.max(rates);
    let startWord = Math.floor((Math.random() * maxRate))
    let text = prop.split(' ');
    let i = startWord;
    while (i < text.length) {
        console.log(text[i].slice(0,1))
        let lastChar = '';
        let firstChar = '';
        if (['.', ',', '!', ';', '·', '-', '–', "'",'"' ].indexOf(text[i].slice(-1)) != -1) {
            lastChar = text[i].slice(-1);
        }
        if (["'",'"'].indexOf(text[i].slice(0,1)) != -1) {
            firstChar = text[i].slice(0,1);
            console.log(firstChar)
        }
        text[i] = firstChar + '{{'+text[i].replace(/\.|\,|\!|\;|·|\-|\–|\'|\"/g, "")+'}}' + lastChar;
        i = i+maxRate;
    }
    let clozeText = {
        original: prop,
        text:text.join(' '),
        rates: rates
    }
    return clozeText
    // return prop
}
function wordbank(content) {
    let ref_arr = []
    $(content).find('[answer]').each(function() {
        let answer = this.getAttribute('answer');
        // answer = answer.replace(/ %% | %%|%% /g, '%%');
        let str = answer.split(/&&|%%|\|\|/g)[0];
            str = str.trim()/* .split(' ') */
            ref_arr.push(str)
        // let str = answer.split(/&&|%%|\|\|/g)[0,1];
        // if (typeof limit === 'number') {
        //     str = answer.split(/&&|%%|\|\|/g)[limit-1];
        //     str = str.trim().split(' ')
        // }
        /* for (w in str) {
            str[w] = str[w].replace(/%%/g, ' ')
            ref_arr.push(str[w]);
        } */
    })
    ref_arr = randomizeArray(ref_arr);
    let wordbank = document.createElement('wordbank');
    for (x in ref_arr) {
        let ref = document.createElement('ref');
            ref.innerHTML = ref_arr[x].replace(/ /g, '&nbsp;')
        $(wordbank).append(ref, '&#8203;');
    }
    content.appendChild(wordbank);
    return content;
}
/* 
    * The following functions are not intended to be called directly by the user
*/
function dnd(content) {
    $(content).on('drop', function() {
        check_section($(this).closest('section'));
    })
    content.className = 'drop';
    wordbank(content);
    return content;
}
function blankify(prop, shuffle) {
    let content_text;
    if (typeof prop === 'string') {
        let text = document.createElement('text');
        content_text = handle_string(prop, text);
    } else {
        let ol = document.createElement('ol');
        li_arr = [];
        for (str in prop) {
            let li = document.createElement('li');
            let list_item = handle_string(prop[str], li); 
            li_arr.push(list_item);
        }
        if (shuffle != false) {
            ol.className = 'shuffle';
            li_arr = randomizeArray(li_arr);
        }
        for (i in li_arr) {
            $(ol).append(li_arr[i]);
        }
        content_text = ol;
    }
    
    return content_text;
}
function handle_string(prop, container) {
    let string = prop.trim();
    string = string.replace(/ %% | %%|%% |%%/g, '%%')
    string = string.replace(/}}/g, '}} ');
    // string = string.replace(/{{/g, ' {{');
    string = string.split(' ');
    // string = string.split(/&#8203;| /);
    let is_still_answer = false;
    let answers = '';
    for (word in string) {
        if (string[word].slice(0, 2) == '{{' || string[word].slice(1, 3) == '{{' || is_still_answer == true) {
            is_still_answer = true;
            answers = answers + (string[word]) + ' ';
            if (string[word].slice(-2) == '}}') {
                // let answer = answers.replace(/{{|}}/g, '');
                let answer = answers.split(/{{|}}/)[1];
                let pre = answers.split(/{{/)[0].replace('{{', ''); // pre is the opening quotation mark if there is one.
                let blank = document.createElement('blank');
                $(blank).attr('answer', answer.trim());
                is_still_answer = false;
                answers = '';
                $(container).append(pre, blank);
            }
        }
        else {
            // if (['"',"'"].indexOf(string[word]) != -1) {
            //     $(container).append(string[word]);
            // } else {
            // }
            $(container).append(string[word] + ' ');
        }
    }
    return container;
}
function randomizeArray(array) {
    var m = array.length, t, i;
      // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}
function check_section(el) {
    if ($(el).find('[answer]').length == $(el).find('.correct').length && $(el).find('.incorrect').length == 0) {
        $(el).addClass('completed');
    } else {
        $(el).removeClass('completed');
    }
}
/* 
    * check_on_enter() is for drag-n-drop and type blanks
*/
function check_on_enter(target, text, answer) {
    let input_text = text.toString().replace(/,|\.|;/g , '').trim();
        input_text = input_text.toLowerCase();
        input_text = input_text.replace(/\u00a0/g, " "); //replace &nbsp; with space
    let answer_text = answer.replace(/ \||\| /g, '|');
        answer_text = answer_text.replace(/%%/g, ' ');
        answer_text = answer_text.replace(/\./g, '').toLowerCase();
    if ( $(target).closest('content').hasClass('normalize') ) {
        /* u0345 is the iota subscript. normalization does not normalize the iota subscript */
        input_text = input_text.normalize('NFD').replace(/[\u0300-\u0344]/g, "")
        input_text = input_text.normalize('NFD').replace(/[\u0346-\u036f]/g, "")
        answer_text = answer_text.normalize('NFD').replace(/[\u0300-\u0344]/g, "")
        answer_text = answer_text.normalize('NFD').replace(/[\u0346-\u036f]/g, "")
    }
    let answer_arr = answer_text.split('||');
    let match = false;
    for (or in answer_arr) {
        let andRef = []; // andRef will fill up with only the letter strings that are in the answer.
        let and = answer_arr[or].split(' && ');
        let a_correct_answer = and.toString().replace(/,/g, ' ');
        for (unit in and) {
            let andx = and[unit].replace(/,|\.|;/g , '');
            if (input_text.indexOf(andx) != -1) {
                andRef.push(andx);
            }
        }
        for (unit in andRef) {
            if (and.length == andRef.length && input_text.length == a_correct_answer.length) {
                match = true;
            } else if (match == false /* && and.length == andRef.length */ && input_text.length > a_correct_answer.length) {
                $(target).addClass('incorrect');
                match = false;
            } else if (andRef.length < and.length) {
                $(target).removeClass('incorrect');
                match = false;
            }
        }
        if (!input_text || input_text.length < a_correct_answer.length) {
            $(target).removeClass('incorrect');   
        }
    }
    if (match == true) {
        $(target).addClass('correct');
        $(target).removeClass('incorrect');
    } else {
        $(target).removeClass('correct');
        // $(target).addClass('incorrect');
    }
}
/*
Drag and drop functions
*/
function allowDrop(ev) {
    ev.preventDefault();
    if (ev.target.getAttribute("draggable") == "true") {
        ev.dataTransfer.dropEffect = "none"; // dropping is not allowed
    } else {
        ev.dataTransfer.dropEffect = "all"; // drop it like it's hot
    }
};
function startdrag(ev) {
    // ev.preventDefault();
    if (ev.path) {
        ev.dataTransfer.setData("id", ev.target.id);
        // console.log(ev.path[0], ev.path[1].innerText, $(ev.path[1]).attr('answer'));
    }
};
function drop(ev) {
    ev.preventDefault();
    var id = ev.dataTransfer.getData("id");
    var dragged = document.getElementById(id);
    dragged.id = '';
    ev.target.appendChild(dragged);
    if (dragged.parentElement.tagName == "WORDBANK") {
        dragged.className = dragged.className.replace(/dropped| wrong/g, "");
    } else {
        dragged.className = "dropped";
    }
    $(ev.path[3]).find('blank').each(function() {
        check_each_blank(this);
    })
};
function check_each_blank(target) {
    let answer = $(target).attr('answer');
    let inner_text = '';
    for (i = 0; i < $(target).find('ref').length; i++) {
        inner_text = inner_text + $(target).find('ref')[i].innerText + ' ';
    }
    if (target.tagName != 'WORDBANK') {
        check_on_enter(target, inner_text, answer);
    }
}
function make_typeable(container) {
    $(container).find('blank').on('keyup', function() {
        let text = $(this).text().trim();
        let answer = $(this).attr('answer');
        check_on_enter(this, text, answer);
        check_section($(this).closest('section'));
    });
    $(container).addClass('type');
}
function dnd_able(container) {
    $(container).find('.drop ref').each(function (num) {
        let id_value = ("drag"+i+'_'+ num.toString());
        $(this).attr("id", id_value);
        $(this).attr("draggable", "true");
        this.addEventListener('dragstart', function(ev) {
            this.id = 'dragging_element'
            ev.dataTransfer.setData("id", 'dragging_element');
        })
        // $(this).attr("ondragstart", "startdrag(event)");
        // $(this).attr("ontouchstart", "startdrag(event)");
    });
    // makes .drop and [drop] zones that are droppable
    $(container).find('.drop blank , .drop wordbank').each(function () {
        $(this).attr("ondragover", "allowDrop(event)");
        $(this).attr("ondrop", "drop(event)");
    });
}
var time;
function play_pause(container, monitor, audio) {
    if (container.isplaying == true) {
        pauseAudio(container);
    } else {
        playAudio(container);
    }
    audio_counter(container, monitor, audio);
};
function pauseAudio(container) {
    $(container).find('audio')[0].pause();
    $(container).find('.player').html(play_button);
    container.isplaying = false;
}
function playAudio(container) {
    $(container).find('audio')[0].play();
    $(container).find('.player').html(pause_button);
    container.isplaying = true;
}
var originalTime;
function audio_counter(container, monitor, audio) {
    let audioLength = audio.duration;
    let audioLocation = audio.currentTime;
    time = setTimeout(function () {
        let barLength = audioLocation * (monitor.offsetWidth - 7) / audioLength;
        if (container.isplaying == true && audioLength > audioLocation) {
            $(container).find('bar')[0].style = 'width:' + barLength + 'px';
            audio_counter(container, monitor, audio);
        } else {
            barLength = 0;
            pauseAudio(container);
        }
    }, 10)
}
function soundBar(container, monitor, audio) {
    $(monitor).mousedown(function () {
        scrubAudio(container, monitor, audio);
        $(this).parent().mousemove(function () {
            scrubAudio(container, monitor, audio);
        });
        $(container).mouseup(function () {
            $(this).off('mousemove');
        });
    });
}
function scrubAudio(container, monitor, audio) {
    let x = event.pageX; // mouse click position
    var p = $(monitor).find('bar').position().left; // position of element clicked
    let place = x - p - 15; //   the 15 is to take margin/padding into account
    if (place < (monitor.offsetWidth - 7) && place > 0) {
        let newLocation = place * audio.duration / (monitor.offsetWidth - 7);
        let barLength = newLocation * (monitor.offsetWidth - 7) / audio.duration;
        $(monitor).find('bar')[0].style = 'width:' + barLength + 'px';
        audio.currentTime = newLocation;
    }
}
