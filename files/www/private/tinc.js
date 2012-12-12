
var nn = "";
var hn = "";


function mysend(obj)
{
    send("/cgi-bin/tinc", obj, function(data) {
        setText("msg", data);
    });
}

function get_onclick(net_name, host_name)
{
    return function() {
        setText("msg", "");
        
        var fs = get("entry");
        hide(fs.parentNode);
        
        removeChilds(fs);
        nn = net_name;
        hn = host_name;
        
        onDesc(get("data"), 'A', function(n) { removeClass(n, "selected"); });
        addClass(this, "selected");
        
        if(hn.length == 0)
            update_net(fs, nn);
        else
            update_host(fs, hn);
    };
}

function appendHeader(fs, text)
{
    var legend = create("legend");
    var span = create("span");
    span.innerHTML = text;
    legend.appendChild(span);
    fs.appendChild(legend);
}

function appendSetting(parent, prefix,  name, value)
{
    if(name == "stype")
        return;

    var id = prefix+"_"+name;
    if(inArray(name, ["enabled", "generate_keys", "DirectOnly", "IndirectData"])) {
        append_radio(parent, name, id, value, [["Ja", 1], ["Nein", 0]]);
    } else if(name == "Mode") {
        append_radio(parent, name, id, value, ["router", "switch", "hub"]);
    } else if(name == "DeviceType") {
        append_radio(parent, name, id, value, ["dummy", "tun", "tap"]);
    } else if(name == "PingTimeout" || name == "Hostnames" || name == "Port") {
        var e = append_input(parent, name, id, value).lastChild;
        addInputCheck(e, /^[1-9]\d*$/, name + " muss eine Nummer sein.");
    } else {
        append_input(parent, name, id, value);
    }
}

function update_net(fs)
{
    send("/cgi-bin/tinc", { func: "get_net", net_name : nn }, function(data) {
        if(show_error(data)) return;
        var obj = parseJSON(data);
        appendHeader(fs, "Netz: '"+nn+"'");
        for(var name in obj)
            appendSetting(fs, nn, name, obj[name]);
        show(fs.parentNode);
    });
}

function update_host(fs)
{
    send("/cgi-bin/tinc", { func: "get_host", host_name : hn }, function(data) {
        if(show_error(data)) return;
        var obj = parseJSON(data);
        appendHeader(fs, "Host: '"+hn+"'");
        for(var name in obj)
            appendSetting(fs, hn, name, obj[name]);
        show(fs.parentNode);
    });
}

function rebuild_list()
{
    hide(get("entry").parentNode);
    send("/cgi-bin/tinc", { func: "get_net_list" }, parse_list);
}

function parse_list(data)
{
    var nets = parseJSON(data);
    var ul = get('data');
    removeChilds(ul);
    
    function makeList(nn, host_list) {
        var ul = create('ul');
        var hosts = split(host_list);
        
        for(var i in hosts)
        {
            if(hosts[i].length == 0)
                continue;
            
            var hn = hosts[i];
            var li = create('li');
            var a = create('a');
            
            a.innerHTML="Host: '"+hn+"'";
            a.onclick = get_onclick(nn, hn);
            
            li.appendChild(a);
            ul.appendChild(li);
       }
       
       return ul;
    }
    
    for(var nn in nets)
    {
        var host_list = nets[nn];
        
        var li = create('li');
        var a = create('a');
        
        a.innerHTML="Netz: '"+nn+"'";
        a.onclick = get_onclick(nn, "");
        
        li.appendChild(a);
        li.appendChild(makeList(nn, host_list));
        
        ul.appendChild(li);
    }
}

function save_entry() 
{
    if(hn.length == 0)
        var obj = { func : "set_net", net_name : nn };
    else
        var obj = { func : "set_host", host_name : hn };
    
    collect_inputs(get("entry"), obj);
    mysend(obj);
}

function delete_entry() 
{
    if(hn.length == 0) {
        if(!confirm("Netz '"+nn+"' wirklich L\xF6schen?\nAlle zugeh\xF6rigen Host-Schl\xFCssel werden geschl\xF6scht!")) return;
        mysend( { func : "del_net", net_name : nn });
    } else {
        if(!confirm("Host '"+hn+"' wirklich L\xF6schen?")) return;
        mysend({ func : "del_host", net_name : nn, host_name : hn });
    }
    rebuild_list();
}

function import_key() {
    if(nn.length == 0)
        return alert("Zuerst muss noch ein Netz ausgew\xE4hlt werden.");
    get("uf_net_name").value = nn;
    get("uf").submit();
}

 function export_key()
 {
    var kn = hn;
    if(kn.length == 0) {
        var obj = {}; collect_inputs(get("entry"), obj); //hackish
        kn = obj[nn+"_Name"];
    }

    if(typeof kn == 'undefined')
        return alert("Schl\xFCsselname is unbekannt.");

    get("df_net_name").value = nn;
    get("df_key_name").value = kn;
    get("df").submit();
 }

function add_net() {
    var net_name = get("new_net_name").value;
    get("new_net_name").value = "";
    mysend({ func : "add_net", net_name : net_name });
    rebuild_list();
}

rebuild_list();
