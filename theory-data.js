/* ============================================================
   樂理補充內容 THEORY
   每個 entry: {title, cat, body:[{h,p?,list?,diagram?}], diagrams?:[...], relatedLesson?:[]}
   diagram 種類同 plan-engine：
     - fretboard {type,startFret,frets,marks?,dots:[{s,f,l,c,t}]}
     - circle    {type:"circle",highlight:[...],caption}
   紅點 c:"#c62828"=根音；藍 c:"#1565c0"=音；黃 c:"#ffc107"=特殊音
   獨立檔案，方便單獨擴充樂理。
   ============================================================ */
const R="#c62828", B="#1565c0", Y="#ffc107", G2="#2e7d32";

const THEORY = {
  "note-names":{title:"音名與指板音位",cat:"基礎",
    body:[
      {h:"12個音",p:"一個八度有12個半音：C C# D D# E F F# G G# A A# B，再回到C。其中 E→F、B→C 之間只差半音(沒有黑鍵)。"},
      {h:"吉他空弦音(粗→細)",list:["6弦=E","5弦=A","4弦=D","3弦=G","2弦=B","1弦=E"]},
      {h:"找音規則",list:["每往高1格 = 升半音","第12格 = 空弦音高八度","記住3、5、7、9、12格的標記點當路標"]},
    ],
    diagrams:[
      {type:"fretboard",startFret:1,frets:12,caption:"第6弦(E)音名分布",
        dots:[{s:6,f:1,l:"F",c:B},{s:6,f:3,l:"G",c:B},{s:6,f:5,l:"A",c:R},{s:6,f:7,l:"B",c:B},{s:6,f:8,l:"C",c:B},{s:6,f:10,l:"D",c:B},{s:6,f:12,l:"E",c:R}]},
      {type:"fretboard",startFret:1,frets:12,caption:"第5弦(A)音名分布",
        dots:[{s:5,f:2,l:"B",c:B},{s:5,f:3,l:"C",c:B},{s:5,f:5,l:"D",c:B},{s:5,f:7,l:"E",c:B},{s:5,f:8,l:"F",c:B},{s:5,f:10,l:"G",c:B},{s:5,f:12,l:"A",c:R}]},
    ],
    relatedLesson:["read-tab","chromatic"]},

  "interval":{title:"音程 (Interval)",cat:"基礎",
    body:[
      {h:"什麼是音程",p:"兩個音之間的距離，用『度』表示。是和弦與音階的建構基礎。"},
      {h:"常用音程(以格數算)",list:["小三度=3格","大三度=4格","完全四度=5格","完全五度=7格(Power Chord的根音到五度)","八度=12格"]},
      {h:"為什麼重要",p:"Power Chord = 根音+完全五度；大和弦 = 根音+大三度+完全五度。懂音程才懂和弦怎麼組成。"},
    ],
    diagrams:[
      {type:"fretboard",startFret:5,frets:4,caption:"根音(紅) + 完全五度 + 八度：Power Chord 的形狀來源",
        dots:[{s:6,f:5,l:"R",c:R},{s:5,f:7,l:"5",c:B},{s:4,f:7,l:"8",c:G2}]},
      {type:"fretboard",startFret:5,frets:4,caption:"大三和弦三音：根音(R)+大三度(3)+完全五度(5)",
        dots:[{s:6,f:5,l:"R",c:R},{s:5,f:4,l:"3",c:Y},{s:5,f:7,l:"5",c:B}]},
    ],
    relatedLesson:["power-chord","bending"]},

  "pentatonic-theory":{title:"五聲音階的原理 + 5個把位",cat:"音階",
    body:[
      {h:"組成",p:"小調五聲音階 = 小調音階去掉2個最容易『不和諧』的音，剩下5個音：根音(1)、♭3、4、5、♭7。"},
      {h:"以 A 小調五聲為例",list:["音:A C D E G","根音 A 是『家』，樂句通常從這裡出發或回到這裡","因為去掉了半音衝突音，怎麼彈都不太會錯 → 適合即興入門"]},
      {h:"五個把位(Box)",p:"同樣5個音在整個指板上會形成5個互相銜接的指型(box)。把它們連起來就能打通整條琴頸。下面紅點都是根音 A：",},
      {h:"大調五聲",p:"同樣5個音換個起點就變大調五聲(明亮)，例如 C 大調五聲 = A 小調五聲同音，差在『以誰為家』。"},
    ],
    diagrams:[
      {type:"fretboard",startFret:5,frets:4,caption:"Box 1（第5格，最常用，根音在6弦）",
        dots:[{s:6,f:5,l:"",c:R},{s:6,f:8,l:"",c:B},{s:5,f:5,l:"",c:B},{s:5,f:7,l:"",c:B},{s:4,f:5,l:"",c:B},{s:4,f:7,l:"",c:R},{s:3,f:5,l:"",c:B},{s:3,f:7,l:"",c:B},{s:2,f:5,l:"",c:B},{s:2,f:8,l:"",c:B},{s:1,f:5,l:"",c:R},{s:1,f:8,l:"",c:B}]},
      {type:"fretboard",startFret:7,frets:4,caption:"Box 2（第7格）",
        dots:[{s:6,f:8,l:"",c:B},{s:6,f:10,l:"",c:B},{s:5,f:7,l:"",c:B},{s:5,f:10,l:"",c:B},{s:4,f:7,l:"",c:R},{s:4,f:10,l:"",c:B},{s:3,f:7,l:"",c:B},{s:3,f:9,l:"",c:B},{s:2,f:8,l:"",c:B},{s:2,f:10,l:"",c:R},{s:1,f:8,l:"",c:B},{s:1,f:10,l:"",c:B}]},
      {type:"fretboard",startFret:9,frets:5,caption:"Box 3（第9-10格）",
        dots:[{s:6,f:10,l:"",c:B},{s:6,f:12,l:"",c:B},{s:5,f:10,l:"",c:B},{s:5,f:12,l:"",c:R},{s:4,f:10,l:"",c:B},{s:4,f:12,l:"",c:B},{s:3,f:9,l:"",c:B},{s:3,f:12,l:"",c:B},{s:2,f:10,l:"",c:R},{s:2,f:13,l:"",c:B},{s:1,f:10,l:"",c:B},{s:1,f:12,l:"",c:B}]},
      {type:"fretboard",startFret:12,frets:4,caption:"Box 4（第12格）",
        dots:[{s:6,f:12,l:"",c:B},{s:6,f:15,l:"",c:B},{s:5,f:12,l:"",c:R},{s:5,f:15,l:"",c:B},{s:4,f:12,l:"",c:B},{s:4,f:14,l:"",c:B},{s:3,f:12,l:"",c:B},{s:3,f:14,l:"",c:R},{s:2,f:13,l:"",c:B},{s:2,f:15,l:"",c:B},{s:1,f:12,l:"",c:B},{s:1,f:15,l:"",c:B}]},
      {type:"fretboard",startFret:14,frets:4,caption:"Box 5（第14-15格，再上去接回 Box 1 高八度）",
        dots:[{s:6,f:15,l:"",c:B},{s:6,f:17,l:"",c:R},{s:5,f:15,l:"",c:B},{s:5,f:17,l:"",c:B},{s:4,f:14,l:"",c:B},{s:4,f:17,l:"",c:B},{s:3,f:14,l:"",c:R},{s:3,f:17,l:"",c:B},{s:2,f:15,l:"",c:B},{s:2,f:17,l:"",c:B},{s:1,f:15,l:"",c:B},{s:1,f:17,l:"",c:R}]},
    ],
    relatedLesson:["pentatonic","pentatonic2","improv","blues-scale"]},

  "blue-note":{title:"Blue Note 藍調音",cat:"音階",
    body:[
      {h:"什麼是 blue note",p:"在小調五聲音階中加入的 ♭5(降五度)。這個音『不穩定』、有張力，正是藍調憂鬱味道的來源。"},
      {h:"怎麼用",list:["當『經過音』快速帶過，不要停留","常配合推弦/滑音從 ♭5 滑到 5","停太久會很不和諧 → 它是調味料不是主菜"]},
    ],
    diagrams:[
      {type:"fretboard",startFret:5,frets:5,caption:"Am Blues：黃色=blue note(♭5)，紅=根音",
        dots:[{s:6,f:5,l:"",c:R},{s:6,f:8,l:"",c:B},{s:5,f:5,l:"",c:B},{s:5,f:6,l:"♭5",c:Y},{s:5,f:7,l:"",c:B},{s:4,f:5,l:"",c:B},{s:4,f:7,l:"",c:R},{s:3,f:5,l:"",c:B},{s:3,f:7,l:"",c:B},{s:3,f:8,l:"♭5",c:Y}]},
    ],
    relatedLesson:["blues-scale"]},

  "major-scale-theory":{title:"大調音階公式 + 指型",cat:"音階",
    body:[
      {h:"全音半音公式",p:"大調音階 = 全-全-半-全-全-全-半 (W-W-H-W-W-W-H)。全音=2格，半音=1格。"},
      {h:"C大調為例",list:["C(全)D(全)E(半)F(全)G(全)A(全)B(半)C","剛好是鋼琴全部白鍵","半音落在 E-F 與 B-C"]},
      {h:"關係小調",p:"從大調的第6個音開始彈 = 它的關係小調。C大調的關係小調是 A 小調(用同樣的音)。下面用 A 小調/C 大調(同音)展示指型，紅=A根音："},
    ],
    diagrams:[
      {type:"fretboard",startFret:5,frets:4,caption:"A自然小調/C大調 指型①(第5格)",
        dots:[{s:6,f:5,l:"",c:R},{s:6,f:7,l:"",c:B},{s:6,f:8,l:"",c:B},{s:5,f:5,l:"",c:B},{s:5,f:7,l:"",c:B},{s:5,f:8,l:"",c:B},{s:4,f:5,l:"",c:B},{s:4,f:7,l:"",c:R},{s:3,f:5,l:"",c:B},{s:3,f:7,l:"",c:B},{s:2,f:5,l:"",c:B},{s:2,f:6,l:"",c:B},{s:2,f:8,l:"",c:B},{s:1,f:5,l:"",c:R},{s:1,f:7,l:"",c:B},{s:1,f:8,l:"",c:B}]},
      {type:"fretboard",startFret:7,frets:5,caption:"A自然小調/C大調 指型②(第7-8格，往上接)",
        dots:[{s:6,f:8,l:"",c:B},{s:6,f:10,l:"",c:B},{s:5,f:7,l:"",c:B},{s:5,f:8,l:"",c:B},{s:5,f:10,l:"",c:B},{s:4,f:7,l:"",c:R},{s:4,f:10,l:"",c:B},{s:3,f:7,l:"",c:B},{s:3,f:9,l:"",c:B},{s:3,f:10,l:"",c:B},{s:2,f:8,l:"",c:B},{s:2,f:10,l:"",c:R},{s:1,f:8,l:"",c:B},{s:1,f:10,l:"",c:B}]},
    ],
    relatedLesson:["major-scale","caged"]},

  "caged-theory":{title:"CAGED 系統 (5個形狀)",cat:"指板",
    body:[
      {h:"核心概念",p:"用 C-A-G-E-D 五個開放和弦的形狀，把同一個和弦在指板上的5個位置串起來，打通整個指板。下面是5個形狀的『母型』(以開放和弦呈現)。"},
      {h:"銜接順序",p:"沿指板往高音方向，形狀循環為 C→A→G→E→D→(回C)。相鄰兩個形狀共用一些音。"},
      {h:"用途",list:["在任何把位都能找到和弦","把音階與和弦『綁在一起』記憶","Solo 時知道現在在哪個和弦的範圍內"]},
      {h:"練法建議",list:["先熟 E 型 與 A 型(最常用的封閉和弦根源)","再把 C/G/D 型補上","用一個和弦(如C)在5個位置都彈出來"]},
    ],
    diagrams:[
      {type:"fretboard",startFret:1,frets:4,caption:"C 形狀 (x32010)",marks:{6:"x",5:"f",4:"f",3:"o",2:"f",1:"o"},
        dots:[{s:5,f:3,l:"3",c:B},{s:4,f:2,l:"2",c:B},{s:2,f:1,l:"1",c:B}]},
      {type:"fretboard",startFret:1,frets:4,caption:"A 形狀 (x02220)",marks:{6:"x",5:"o",4:"f",3:"f",2:"f",1:"o"},
        dots:[{s:4,f:2,l:"1",c:B},{s:3,f:2,l:"2",c:B},{s:2,f:2,l:"3",c:B}]},
      {type:"fretboard",startFret:1,frets:4,caption:"G 形狀 (320003)",marks:{6:"f",5:"f",4:"o",3:"o",2:"o",1:"f"},
        dots:[{s:6,f:3,l:"2",c:B},{s:5,f:2,l:"1",c:B},{s:1,f:3,l:"3",c:B}]},
      {type:"fretboard",startFret:1,frets:4,caption:"E 形狀 (022100) — 最常變封閉和弦",marks:{6:"o",5:"f",4:"f",3:"f",2:"o",1:"o"},
        dots:[{s:5,f:2,l:"2",c:B},{s:4,f:2,l:"3",c:B},{s:3,f:1,l:"1",c:B}]},
      {type:"fretboard",startFret:1,frets:4,caption:"D 形狀 (xx0232)",marks:{6:"x",5:"x",4:"o",3:"f",2:"f",1:"f"},
        dots:[{s:3,f:2,l:"1",c:B},{s:1,f:2,l:"2",c:B},{s:2,f:3,l:"3",c:B}]},
    ],
    relatedLesson:["caged","major-scale"]},

  "diatonic-theory":{title:"順階和弦與級數",cat:"和聲",
    body:[
      {h:"順階和弦",p:"用一個調的音堆疊出的7個和弦。大調的級數品質固定為：I(大) ii(小) iii(小) IV(大) V(大) vi(小) vii°(減)。"},
      {h:"C大調順階和弦",list:["I=C, ii=Dm, iii=Em, IV=F, V=G, vi=Am, vii°=Bdim","流行神進行 I–V–vi–IV = C–G–Am–F","12小節藍調 = I–IV–V"]},
      {h:"五度圈",p:"順時針每格上行完全五度。相鄰的和弦最常一起出現(如 C-G-F 就是 I-V-IV)。橘色為 C 大調的 I(C)、IV(F)、V(G)："},
      {h:"用級數抓歌/移調",p:"聽出進行的『級數』而非絕對和弦，換任何調都能立刻彈，這是抓歌與即興的關鍵能力。"},
    ],
    diagrams:[
      {type:"circle",highlight:["C","F","G"],caption:"五度圈：橘=C大調的 I / IV / V"},
    ],
    relatedLesson:["diatonic","open-chords","improv"]},

  "rhythm-theory":{title:"節奏與拍子",cat:"節奏",
    body:[
      {h:"拍號",p:"4/4 = 每小節4拍、以四分音符為1拍，最常見。"},
      {h:"音符時值",list:["全音符=4拍","二分音符=2拍","四分音符=1拍","八分音符=半拍(數 1 & 2 &)","十六分音符=1/4拍(數 1 e & a)"]},
      {h:"切分音",p:"把重音放到反拍(& 或 e a 的位置)，製造推進與律動感，是 funk/流行的味道來源。"},
    ],
    diagrams:[
      {type:"strum",caption:"十六分音符數法：1 e & a｜＞=重音落在反拍=切分",
        beats:[{b:"1",d:"D"},{b:"e",d:"U"},{b:"&",d:"D",a:true},{b:"a",d:"U"},{b:"2",d:"D"},{b:"e",d:"U"},{b:"&",d:"D",a:true},{b:"a",d:"U"}]},
    ],
    relatedLesson:["rhythm-basic","syncopation","funk-strum","strum-basic"]},
};
