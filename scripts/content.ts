// Sadržaj programa za seed. Pravi tekst, ne lorem ipsum.

export type SeedLesson = {
  title: string;
  duration_min: number;
  /** Andreja dodaje svoj link u uredniku; demo ne nosi tuđe snimke. */
  video_url?: string | null;
  body: string;
  worksheet?: { title: string; questions: string[] };
};

export type SeedModule = {
  title: string;
  subtitle: string;
  summary: string;
  lessons: SeedLesson[];
  assignment: { title: string; instructions: string };
};

export const modules: SeedModule[] = [
  {
    title: "Odnos s novcem",
    subtitle: "Odakle dolaze tvoje odluke o novcu",
    summary:
      "Prije nego dotaknemo ijednu tablicu, gledamo odakle dolaze tvoje odluke. Novac je rijetko samo matematika.",
    lessons: [
      {
        title: "Šta si naučila o novcu prije nego si ga zaradila",
        duration_min: 14,
        body: `Većina žena koje dođu u ovaj program zna sabirati i oduzimati. Problem nikad nije bio u računu. Problem je u tome što odluku o novcu donosiš u tri sekunde, a razlog za tu odluku star je dvadeset godina.

Razmisli kako se o novcu govorilo u kući u kojoj si odrasla. Je li se govorilo glasno, šapatom, ili se nije govorilo uopće? Je li novac bio razlog za svađu, za tišinu za stolom, ili za osjećaj da nešto ne smiješ tražiti? To nisu sentimentalna pitanja. To su pitanja koja objašnjavaju zašto ti se danas steže u grlu kad trebaš poslati ponudu.

Postoje tri obrasca koja vidim najčešće. Prvi je **izbjegavanje**: ne otvaraš aplikaciju banke, ne gledaš stanje, računi stoje neotvoreni. Drugi je **stezanje**: sve je škrto, ništa se ne smije potrošiti, a kad se potroši slijedi krivnja. Treći je **rasipanje kao olakšanje**: nakon teške sedmice kupovina je jedino mjesto gdje si dobra prema sebi.

Nijedan od ova tri obrasca nije karakterna mana. Sva tri su naučena, i sva tri se mogu odučiti. Ali samo ako ih prvo nazoveš imenom.

U ovoj lekciji te ne tražim da išta promijeniš. Tražim te samo da prepoznaš koji ti je obrazac najbliži i kad si ga zadnji put vidjela na djelu.`,
        worksheet: {
          title: "Radni list 1.1 — Tvoja priča o novcu",
          questions: [
            "Koja je prva rečenica o novcu koje se sjećaš iz djetinjstva?",
            "Ko je u tvojoj kući donosio odluke o novcu i kako si to znala?",
            "Koji od tri obrasca (izbjegavanje, stezanje, rasipanje) ti je najbliži?",
            "Kad si zadnji put osjetila nelagodu vezanu za novac? Šta se tačno desilo?",
            "Šta bi voljela da si naučila o novcu, a nisi?",
          ],
        },
      },
      {
        title: "Krivnja, sram i zašto ne gledaš stanje računa",
        duration_min: 11,
        body: `Krivnja kaže: potrošila sam previše. Sram kaže: ja sam osoba koja ne zna s novcem. Razlika nije jezična. Krivnja se odnosi na postupak i može se popraviti. Sram se odnosi na identitet i zato paralizira.

Kad ne otvaraš aplikaciju banke, ne bježiš od brojke. Bježiš od rečenice koju ćeš sebi reći kad je vidiš. Brojka je neutralna. Rečenica nije.

Vježba koju ćeš raditi cijeli program je jednostavna: kad pogledaš brojku, opišeš je bez pridjeva. Ne "užasno malo", nego "412 eura". Ne "katastrofa", nego "tri računa nisu plaćena". Jezik bez pridjeva vraća ti mogućnost da nešto uradiš, jer se odjednom radi o zadatku, a ne o presudi.

Ovo zvuči kao sitnica. Nije. Žene koje ovo urade dosljedno kroz osam sedmica prijavljuju da im je otvaranje bankovne aplikacije prestalo biti događaj. To je cilj: da novac postane dosadan.`,
      },
      {
        title: "Šta želiš da novac radi za tebe",
        duration_min: 9,
        body: `Pitanje "koji je tvoj finansijski cilj" obično dobije odgovor koji zvuči kao iz časopisa. Stan. Putovanje. Sigurnost. Sve tačno, ništa upotrebljivo.

Bolje pitanje je: **šta bi se u tvojoj sedmici promijenilo da novac nije problem?** Odgovor je konkretan. Ne bih računala prije nego naručim. Ne bih odgađala zubara. Rekla bih ne klijentu koji kasni s plaćanjem. Uzela bih petak popodne slobodno.

Napiši tri takve rečenice. To su tvoji ciljevi, i svaka od njih ima cijenu koju ćemo izračunati u modulu 5.

Primijeti da nijedna od tih rečenica nije brojka. Brojke dolaze kasnije i one su lakši dio. Teži dio je dopustiti si da nešto želiš naglas.`,
      },
    ],
    assignment: {
      title: "Tvoja priča o novcu",
      instructions: `Napiši 10-15 rečenica o svom odnosu s novcem.

Koristi ova pitanja kao okvir, ne moraš odgovoriti na sva:

- Koja je prva rečenica o novcu koje se sjećaš?
- Koji od tri obrasca (izbjegavanje, stezanje, rasipanje) prepoznaješ kod sebe?
- Šta bi se u tvojoj sedmici promijenilo da novac nije problem?

**Piši bez pridjeva gdje god možeš.** Ovo čita samo tvoja asistentica i ja.`,
    },
  },

  {
    title: "Mapa troškova",
    subtitle: "Gdje novac stvarno odlazi",
    summary:
      "Četiri sedmice podataka vrijede više od bilo koje procjene. Ovaj modul je isključivo o tome da vidiš tačno.",
    lessons: [
      {
        title: "Zašto procjena uvijek promaši",
        duration_min: 10,
        body: `Kad te pitam koliko mjesečno potrošiš na hranu, reći ćeš broj. Taj broj je gotovo uvijek 30 do 40 posto manji od stvarnog.

Razlog nije nepoštenje. Razlog je to što pamtimo velike kupovine, a ne male. Sjećaš se mjesečne nabavke. Ne sjećaš se sedam odlazaka u trgovinu "po dvije stvari" koji zajedno koštaju više.

Zato ne počinjemo s budžetom. Počinjemo s mapom. Mapa je zapis onoga što se stvarno desilo, bez plana i bez osude. Četiri sedmice. Ni jedan dan manje, jer mjesec ima ritam koji kraći period ne uhvati.

Dvije stvari koje ljudi rade pogrešno: mijenjaju ponašanje dok mjere, i odustanu nakon deset dana jer se "ništa ne dešava". Ne mijenjaj ništa i ne odustaj. Podatak je jedini cilj.`,
        worksheet: {
          title: "Radni list 2.1 — Četiri sedmice mapiranja",
          questions: [
            "Koliko misliš da mjesečno potrošiš na hranu? Zapiši broj prije mjerenja.",
            "Koje su ti tri kategorije u kojima najčešće trošiš bez razmišljanja?",
            "Koji dan u sedmici najviše trošiš i zašto?",
            "Koji trošak si prošli mjesec platila, a da ga nisi primijetila?",
            "Šta bi te iznenadilo da vidiš u svojoj mapi?",
          ],
        },
      },
      {
        title: "Četiri kante: fiksno, promjenjivo, povremeno, nevidljivo",
        duration_min: 13,
        body: `Ne trebaju ti dvadeset dvije kategorije. Trebaju ti četiri.

**Fiksno** je ono što je svakog mjeseca isto: stanarina, rate, pretplate. Ovo je najlakše vidjeti i najteže mijenjati.

**Promjenjivo** je ono što trošiš svaki mjesec, ali u različitim iznosima: hrana, gorivo, higijena. Ovdje je najviše prostora, ali i najviše otpora.

**Povremeno** je ono što dolazi nekoliko puta godišnje i svaki put te iznenadi: registracija auta, rođendani, zimska jakna, zubar. Ovo je kategorija koja ruši budžete, jer je svi računaju kao "izvanredno", a dešava se svakog mjeseca nešto iz nje.

**Nevidljivo** su pretplate koje se same obnavljaju, provizije, zaokruživanja, sitni iznosi ispod pet eura. Prosječno domaćinstvo ovdje izgubi iznos jedne mjesečne rate, a da nikad ne donese odluku o tome.

Kad rasporediš mapu u ove četiri kante, obično se dogodi ista stvar: povremeno i nevidljivo zajedno budu veći nego što si očekivala. To nije loša vijest. To je prostor.`,
      },
      {
        title: "Prvi pogled bez osuđivanja",
        duration_min: 8,
        body: `Kad prvi put vidiš svoju mapu, doći će reakcija. Kod većine je to nelagoda, kod nekih olakšanje, kod nekih bijes na sebe.

Pravilo je: **prvi pogled je samo gledanje.** Ne donosiš nijednu odluku istog dana. Ne otkazuješ pretplate, ne praviš pravila, ne obećavaš si ništa.

Razlog je praktičan. Odluke donesene iz nelagode su prestroge i ne traju. Ti ne trebaš plan koji izdrži tri dana. Trebaš plan koji izdrži do proljeća.

Sjedni s mapom, pročitaj je naglas ako možeš, i napiši samo tri rečenice: šta me iznenadilo, šta sam očekivala, šta ne razumijem. Ostalo radimo u modulu 3.`,
      },
    ],
    assignment: {
      title: "Mapa troškova za četiri sedmice",
      instructions: `Zapiši sve troškove iz zadnje četiri sedmice i rasporedi ih u četiri kante: **fiksno**, **promjenjivo**, **povremeno**, **nevidljivo**.

Možeš koristiti izvod iz banke, aplikaciju, ili papir — nije bitno kako.

U odgovor napiši:
1. Ukupan iznos po svakoj kanti
2. Tri rečenice: šta me iznenadilo, šta sam očekivala, šta ne razumijem

Ako želiš, priloži tablicu kao PDF ili sliku.`,
    },
  },

  {
    title: "Budžet bez odricanja",
    subtitle: "Plan koji izdrži i loš mjesec",
    summary:
      "Budžet koji zabranjuje ne traje. Ovdje gradimo plan koji ima ugrađen prostor za život.",
    lessons: [
      {
        title: "Zašto restriktivni budžeti pucaju",
        duration_min: 12,
        body: `Svaka žena koja je ikad bila na dijeti zna kako ovo ide. Prva sedmica je savršena. Druga je dobra. Treća ima jedan loš dan, i taj loš dan postane dokaz da "to kod mene ne ide".

Budžet radi isto. Ako ti plan zabranjuje sve što voliš, ti ga ne kršiš zato što si slaba. Kršiš ga zato što je plan bio nemoguć.

Dobar budžet ima tri osobine. **Ima prostor za život** — iznos koji smiješ potrošiti bez objašnjenja. **Pretpostavlja loš mjesec** — jer loš mjesec dolazi dva-tri puta godišnje. I **ne traži dnevnu pažnju** — ako ga moraš gledati svaki dan, napustit ćeš ga.

Pravilo koje koristim: ako novi plan traži više od deset minuta tvoje pažnje sedmično, prekompliciran je.`,
        worksheet: {
          title: "Radni list 3.1 — Tvoj prvi budžet",
          questions: [
            "Koliki ti je prosječni mjesečni prihod u zadnja tri mjeseca?",
            "Koliko iznosi tvoja kanta 'fiksno'?",
            "Koji iznos želiš odvojiti kao 'prostor za život' (bez objašnjenja)?",
            "Koliko mjesečno moraš odvojiti za kantu 'povremeno'?",
            "Koji je iznos koji ostaje i šta s njim radiš?",
          ],
        },
      },
      {
        title: "Pravilo 50/30/20 i kad ga treba prekršiti",
        duration_min: 15,
        body: `Pravilo kaže: 50 posto prihoda na potrebe, 30 posto na želje, 20 posto na štednju i dugove. Korisno je kao polazna tačka i beskorisno kao pravilo.

Ako živiš u gradu gdje stanarina uzima 45 posto prihoda, pravilo od 50 posto za sve potrebe je matematički nemoguće. Ako imaš dug s visokom kamatom, 20 posto je premalo. Ako ti je prihod nepredvidiv, postotak od čega uopće računaš?

Koristi ga ovako: izračunaj svoje stvarne postotke iz mape iz modula 2. Usporedi. Razlika ti pokazuje gdje je pritisak, ne gdje si pogriješila.

Za nepredvidiv prihod postoji bolja metoda: **računaj s najnižim mjesecom zadnjih godinu dana.** Sve iznad toga je višak koji ide u rezervu. Ovo je neudobno prvih par mjeseci i spasonosno nakon toga.`,
      },
      {
        title: "Prostor za život: iznos koji ne pravdaš nikome",
        duration_min: 9,
        body: `Ovo je lekcija koju žene najčešće preskoče, a najviše im treba.

Odredi iznos — tjedni ili mjesečni — koji možeš potrošiti bez ikakvog objašnjenja. Ni sebi, ni partneru, ni meni. Kafa, knjiga, ništa, svejedno. Iznos je tvoj i nema izvještaja.

Dvije stvari se dese kad ovo uvedeš. Prva: prestaje krivnja oko sitnih kupovina, jer su unaprijed dogovorene. Druga: ukupna potrošnja u toj kategoriji obično **padne**, jer je odluka donesena jednom mjesečno umjesto trideset puta.

Iznos neka bude realan. Ako je premali, nećeš ga poštovati. Preporuka za početak: između 5 i 10 posto prihoda, pa korigiraj nakon dva mjeseca.`,
      },
    ],
    assignment: {
      title: "Budžet za sljedeći mjesec",
      instructions: `Na osnovu mape iz modula 2, napravi budžet za sljedeći mjesec.

Mora sadržavati:
- Iznos po svakoj od četiri kante
- **Prostor za život** — iznos koji trošiš bez objašnjenja
- Jedan iznos za kantu "povremeno" koji odvajaš svakog mjeseca

U odgovoru napiši i jednu rečenicu: **šta će se prvo srušiti ako mjesec bude loš?**`,
    },
  },

  {
    title: "Cijene i naplata",
    subtitle: "Koliko vrijedi tvoj rad i kako to tražiš",
    summary:
      "Za sve koje rade svoje: kako postaviti cijenu, kako je izgovoriti i kako naplatiti bez izvinjavanja.",
    lessons: [
      {
        title: "Cijena nije procjena tvoje vrijednosti",
        duration_min: 13,
        body: `Kad ti se steže u grlu prije nego kažeš cijenu, to je zato što u tom trenutku ne govoriš o usluzi. Govoriš o sebi.

Odvoji to dvoje. Cijena je broj koji pokriva tvoje vrijeme, troškove, poreze, neplaćene sate i rizik. Ona nije ocjena koliko si dobra. Klijent koji kaže "skupo" nije rekao "ti ne vrijediš". Rekao je da mu se ne uklapa u budžet, što je informacija, ne presuda.

Izračun koji radiš u zadatku: koliko sati mjesečno stvarno naplaćuješ (ne koliko radiš), koliki ti je ciljani prihod, koliki su fiksni troškovi posla, i koliki postotak ide na porez i doprinose. Podijeli. Dobiješ minimalnu satnicu ispod koje radiš s gubitkom.

Većina žena koje ovo prvi put izračunaju otkrije da im je trenutna cijena 30 do 50 posto ispod tog minimuma.`,
        worksheet: {
          title: "Radni list 4.1 — Izračun minimalne satnice",
          questions: [
            "Koliko sati mjesečno stvarno naplatiš (ne koliko radiš)?",
            "Koliki je tvoj ciljani mjesečni prihod nakon poreza?",
            "Koliki su fiksni mjesečni troškovi posla?",
            "Koji postotak odlazi na porez i doprinose?",
            "Koja je tvoja minimalna satnica i koliko je daleko od trenutne?",
          ],
        },
      },
      {
        title: "Kako izgovoriti cijenu i onda šutjeti",
        duration_min: 10,
        body: `Postoji jedna tehnika koja mijenja više nego bilo koji izračun: **kažeš cijenu i zastaneš.**

Ono što većina radi je: kaže cijenu, pa odmah doda "ali mogu i malo niže", "znam da je to možda puno", "ako treba možemo dogovoriti". Svaka od tih rečenica pregovara protiv tebe prije nego je druga strana rekla išta.

Rečenica glasi: "Za ovaj opseg cijena je X." Tačka. Onda šutiš i pustiš drugu osobu da odgovori.

Tišina će ti trajati beskonačno. Traje tri sekunde. Vježbaj naglas, sama, deset puta. Zvuči smiješno dok ne proradi.

Ako te pitaju za popust, odgovor nije da ili ne. Odgovor je: "Mogu prilagoditi cijenu ako smanjimo opseg — šta ti je od ovoga najmanje važno?" Time cijena ostaje povezana s radom, a ne s tvojom voljom da ugodiš.`,
      },
      {
        title: "Naplata: rokovi, podsjetnici i kad prestati raditi",
        duration_min: 11,
        body: `Nenaplaćen posao nije posao. To je poklon s fakturom.

Tri pravila koja rješavaju 90 posto problema s naplatom:

**Avans.** Za nove klijente 30 do 50 posto unaprijed. Ovo nije nepovjerenje, to je standard. Klijent koji odbije avans obično je isti onaj koji kasni s ostatkom.

**Rok napisan brojem.** Ne "po završetku", nego "15 dana od datuma računa". Datum se ne pregovara, jer je bio na ponudi koju je potpisao.

**Podsjetnik bez izvinjenja.** Dan nakon roka: "Podsjećam na račun broj 24, dospio jučer. Hvala." Bez "oprosti što gnjavim". Nisi ti ta koja gnjavi.

I zadnje: odredi unaprijed tačku na kojoj prestaješ raditi ako nije plaćeno. Napiši je u ponudu. Ne moraš je koristiti često, ali moraš je imati.`,
        worksheet: {
          title: "Radni list 4.3 — Uslovi naplate",
          questions: [
            "Koliki avans tražiš od novih klijenata i kako to formuliraš?",
            "Koji rok plaćanja pišeš na račun, izražen brojem dana?",
            "Kako glasi tvoj prvi podsjetnik nakon isteka roka?",
            "U kojem trenutku prestaješ raditi ako nije plaćeno?",
            "Koji klijent ti trenutno duguje i šta mu šalješ ove sedmice?",
          ],
        },
      },
    ],
    assignment: {
      title: "Izračun cijene i jedna poslana ponuda",
      instructions: `Dva dijela:

**1. Izračun.** Izračunaj svoju minimalnu satnicu po formuli iz lekcije 4.1. Napiši brojke.

**2. Ponuda.** Napiši (i ako možeš pošalji) jednu ponudu po novoj cijeni. Bez rečenica koje pregovaraju protiv tebe.

U odgovor kopiraj tekst ponude. Gledat ćemo formulaciju zajedno.`,
    },
  },

  {
    title: "Rezerva i štednja",
    subtitle: "Koliko ti treba da prestaneš strahovati",
    summary:
      "Rezerva nije luksuz nego uvjet za sve ostalo. Računamo tvoj tačan iznos i put do njega.",
    lessons: [
      {
        title: "Tri mjeseca ili šest: koliki je tvoj broj",
        duration_min: 12,
        body: `Opće pravilo kaže tri do šest mjeseci troškova. Kao i sva opća pravila, korisno je dok ne dođeš do svoje situacije.

Tvoj broj ovisi o četiri stvari: koliko ti je prihod predvidiv, koliko ljudi ovisi o tebi, koliko brzo bi našla novi posao ili klijenta, i koliko duga imaš.

Stalni posao, bez djece, tražena struka — tri mjeseca je dosta. Vlastiti posao s nepredvidivim prihodom i dijete — šest mjeseci je minimum, devet je mirnije.

Važnije od tačnog broja: **računaš mjesece troškova, ne mjesece prihoda.** To je obično 25 do 35 posto manji iznos i zato dostižniji nego što izgleda.

Izračunaj svoj broj danas. Ne da bi ga odmah imala, nego da prestaneš strahovati od nepoznatog iznosa.`,
        worksheet: {
          title: "Radni list 5.1 — Tvoja rezerva",
          questions: [
            "Koliki su ti mjesečni troškovi u minimalnoj verziji (bez želja)?",
            "Koliko mjeseci rezerve ti treba s obzirom na tvoju situaciju?",
            "Koliki je ukupan iznos rezerve?",
            "Koliko mjesečno možeš odvojiti i koliko će trebati?",
            "Gdje ćeš držati rezervu da ti ne bude previše pri ruci?",
          ],
        },
      },
      {
        title: "Gdje držati rezervu",
        duration_min: 8,
        body: `Rezerva ima dva zahtjeva: da joj možeš pristupiti za nekoliko dana, i da ti nije toliko pri ruci da je potrošiš na nešto što nije hitno.

Zato ne na tekućem računu s karticom. I ne u nečemu što traje mjesecima da se unovči.

Praktično rješenje za većinu: poseban štedni račun, po mogućnosti u drugoj banci, bez kartice, s trajnim nalogom koji prebacuje iznos na dan plaće. Automatizacija je ovdje cijeli trik — odluka se donosi jednom, ne svaki mjesec.

Ako ti je prihod nepredvidiv, trajni nalog zamijeni pravilom: **svaki priliv, prvih 10 posto odmah ide u rezervu.** Prije svega ostalog.`,
      },
      {
        title: "Kad smiješ dirati rezervu",
        duration_min: 7,
        body: `Napiši ovo unaprijed, dok si mirna, jer u trenutku kad zatreba nećeš razmišljati jasno.

Rezerva se dira kad je nešto **neplanirano, nužno i hitno.** Sve tri, ne jedna od tri.

Pokvaren bojler u januaru: da. Gume koje su se istrošile: to je bilo planirano, ide iz kante "povremeno". Putovanje s prijateljicama koje se "dešava jednom u životu": ne, koliko god boljelo.

I posljednje pravilo, ono koje ljudi zaborave: **kad je potrošiš, vraćanje rezerve postaje prioritet broj jedan** — ispred štednje, ispred investiranja, ispred svega osim minimalnih rata duga.`,
      },
    ],
    assignment: {
      title: "Izračun rezerve i prvi trajni nalog",
      instructions: `1. Izračunaj svoj iznos rezerve (mjeseci × minimalni mjesečni troškovi).
2. Napiši koliko mjesečno možeš odvojiti i za koliko mjeseci ćeš doći do cilja.
3. **Postavi trajni nalog** (ili pravilo od 10 posto po prilivu) i napiši da si to uradila.

U odgovoru navedi i gdje ćeš držati rezervu i zašto baš tamo.`,
    },
  },

  {
    title: "Dugovi bez srama",
    subtitle: "Redoslijed, plan i razgovor s bankom",
    summary:
      "Dug je matematika s kamatom, ne dokaz o karakteru. Ovaj modul je najpraktičniji u programu.",
    lessons: [
      {
        title: "Popis svih dugova na jednom papiru",
        duration_min: 11,
        body: `Najteži dio nije otplata. Najteži dio je napisati sve na jedno mjesto.

Za svaki dug trebaju ti četiri podatka: **preostali iznos**, **kamatna stopa**, **mjesečna rata**, **datum završetka**. Kartice, minus po računu, potrošački krediti, pozajmica od sestre, rate za telefon. Sve.

Skoro svaka žena koja ovo napravi kaže istu stvar: ukupan iznos je manji nego što je mislila, ali kamata na jednoj stavki je puno veća nego što je znala. To je tipično. Minus po tekućem računu i kartice su gotovo uvijek najskuplji novac koji imaš.

Kad imaš popis, dug prestaje biti oblak i postaje lista. Lista se može rješavati redom.`,
        worksheet: {
          title: "Radni list 6.1 — Popis dugova",
          questions: [
            "Popiši sve dugove: iznos, kamata, rata, datum završetka.",
            "Koji dug ima najvišu kamatnu stopu?",
            "Koji dug ima najmanji preostali iznos?",
            "Koliko ukupno mjesečno odlazi na rate?",
            "Koji dug bi ti najviše olakšao kad bi nestao?",
          ],
        },
      },
      {
        title: "Lavina ili gruda: koji redoslijed odabrati",
        duration_min: 12,
        body: `Postoje dvije metode i obje rade.

**Lavina**: prvo otplaćuješ dug s najvišom kamatom, ostale plaćaš minimalno. Matematički je jeftinija — platiš manje kamate ukupno.

**Gruda**: prvo otplaćuješ najmanji iznos, bez obzira na kamatu. Psihološki je jača — prvi dug nestane brzo i to ti da zalet.

Koju odabrati? Ako je razlika u kamatama velika (recimo kartica na 18 posto naspram kredita na 5 posto), idi lavinom. Ako su kamate slične, ili ako si već pokušala i odustala, idi grudom.

Odabir metode nije moralno pitanje. Najbolja metoda je ona koju ćeš stvarno provesti do kraja.

Jedno pravilo vrijedi za obje: **dok otplaćuješ, ne praviš novi dug.** Zvuči očito, ali to je mjesto gdje planovi najčešće padnu.`,
      },
      {
        title: "Razgovor s bankom: šta tražiti i kojim riječima",
        duration_min: 10,
        body: `Banka nije neprijatelj i nije prijatelj. Banka je institucija s procedurama, a procedure imaju mogućnosti o kojima ti niko neće reći ako ne pitaš.

Tri stvari koje vrijedi tražiti: **refinansiranje** skupljeg duga jeftinijim, **reprogram** ako ti je rata preteška, i **snižavanje kamate** ako ti se kreditna sposobnost poboljšala otkad si uzela kredit.

Kako to reći: "Imam kredit iz 2023. s kamatom od X. Moja situacija se u međuvremenu promijenila. Koje mogućnosti imam za snižavanje kamate ili reprogram?"

Nemoj se izvinjavati i nemoj objašnjavati privatne okolnosti više nego što treba. Ovo je poslovni razgovor.

I obavezno: **traži ponudu u pisanom obliku** i usporedi je s postojećim stanjem prije nego potpišeš bilo šta. Refinansiranje koje produži rok može smanjiti ratu, a povećati ukupnu kamatu.`,
      },
    ],
    assignment: {
      title: "Popis dugova i plan otplate",
      instructions: `1. Napravi popis svih dugova (iznos, kamata, rata, datum završetka).
2. Odaberi metodu — **lavina** ili **gruda** — i napiši zašto baš ta.
3. Napiši redoslijed otplate i procijenjeni datum kad prvi dug nestaje.

Ako nemaš dugova, napiši umjesto toga plan šta radiš s iznosom koji bi inače išao na rate.`,
    },
  },

  {
    title: "Osnove investiranja",
    subtitle: "Šta je dovoljno znati za prvi korak",
    summary:
      "Bez preporuka i bez obećanja. Samo pojmovi koji ti trebaju da razumiješ o čemu se radi.",
    lessons: [
      {
        title: "Šta investiranje jest i šta nije",
        duration_min: 14,
        body: `Investiranje je kupovina nečega što bi vremenom moglo vrijediti više, uz prihvaćen rizik da bi moglo vrijediti manje. To je cijela definicija.

Ono što investiranje **nije**: nije štednja (štednja ima zajamčen iznos, investiranje nema), nije brzo (razmišljaj u godinama, ne mjesecima), i nije nešto u šta ulaziš prije nego imaš rezervu i prije nego riješiš skupe dugove.

Redoslijed je uvijek isti: **rezerva → skupi dugovi → investiranje.** Ako investiraš dok imaš dug na kartici od 18 posto, matematika radi protiv tebe bez obzira koliko je investicija dobra.

Ovaj modul nema preporuke. Ja nisam licencirana savjetnica i neću ti reći šta da kupiš. Cilj je da razumiješ pojmove dovoljno da postavljaš prava pitanja kad razgovaraš s nekim ko jest licenciran.`,
        worksheet: {
          title: "Radni list 7.1 — Jesi li spremna",
          questions: [
            "Imaš li rezervu od barem tri mjeseca troškova?",
            "Imaš li dug s kamatom većom od 8 posto?",
            "Za koliko godina bi ti taj novac mogao zatrebati?",
            "Koliki pad vrijednosti bi podnijela bez panike?",
            "Koje pojmove još ne razumiješ dovoljno?",
          ],
        },
      },
      {
        title: "Rizik, vrijeme i zašto se ne gleda svaki dan",
        duration_min: 11,
        body: `Rizik u investiranju nije "možeš izgubiti sve". Rizik je **koliko vrijednost oscilira i koliko dugo možeš čekati da se oporavi.**

Zato je vrijeme najvažnija varijabla. Novac koji ti treba za dvije godine i novac koji ti ne treba petnaest godina nisu ista vrsta novca i ne idu na isto mjesto.

Druga stvar: gledanje vrijednosti svaki dan šteti. Ne zato što je informacija loša, nego zato što svakodnevne oscilacije izgledaju dramatično i izazivaju odluke koje dugoročno koštaju. Ljudi koji provjeravaju rijetko prolaze bolje od onih koji provjeravaju često. To je dosljedan nalaz.

Postavi si pravilo unaprijed: koliko često gledaš i šta te može natjerati da prodaš. Napiši to dok si mirna.`,
      },
      {
        title: "Prva pitanja koja postavljaš prije nego uložiš išta",
        duration_min: 10,
        body: `Kad ti neko nudi bilo kakav proizvod — banka, savjetnik, poznanica s "prilikom" — postavi ovih pet pitanja:

1. **Koliko ovo košta godišnje, u postotku i u eurima?** Naknade se čine male dok ih ne pomnožiš s dvadeset godina.
2. **Kako i za koliko dana mogu doći do svog novca?**
3. **Šta se desi ako prestanem uplaćivati?**
4. **Ko zarađuje na mojoj uplati i koliko?**
5. **Je li ova osoba licencirana i čime je plaćena?**

Ako na bilo koje pitanje ne dobiješ jasan odgovor u pisanom obliku, odgovor je ne.

I pravilo koje vrijedi uvijek: **ne ulaži u ono što ne možeš objasniti prijateljici u tri rečenice.**`,
      },
    ],
    assignment: {
      title: "Provjera spremnosti i pet pitanja",
      instructions: `1. Odgovori na pitanja iz radnog lista 7.1 — jesi li spremna za prvi korak.
2. Napiši svojim riječima **pet pitanja** koja ćeš postaviti prije nego uložiš išta.
3. Napiši jednu rečenicu: koji pojam ti je još nejasan?

Ovo nije zadatak u kojem nešto kupuješ. Ovo je zadatak u kojem provjeravaš gdje si.`,
    },
  },

  {
    title: "Plan za 12 mjeseci",
    subtitle: "Šta radiš kad program završi",
    summary:
      "Sve iz prethodnih sedam modula pretvaramo u jedan papir koji ti stoji na vidljivom mjestu.",
    lessons: [
      {
        title: "Tri brojke koje pratiš i ništa više",
        duration_min: 10,
        body: `Nakon programa nemaš mene, nemaš asistenticu i nemaš sedmične pozive. Zato plan mora biti dovoljno jednostavan da ga održiš sama.

Tri brojke, jednom mjesečno, deset minuta:

**Stanje rezerve.** Raste li, stoji li, pada li.
**Ukupan dug.** Jedan broj, svi dugovi zajedno.
**Potrošnja u kanti "promjenjivo".** Jedina kanta koju stvarno kontroliraš iz mjeseca u mjesec.

Ne prati ništa drugo. Ne prati dnevno. Ne pravi tablice s petnaest kartica jer ćeš ih napustiti do marta.

Upiši te tri brojke u isti dokument svakog mjeseca, na isti dan. Nakon šest mjeseci imaš trend, a trend je jedino što zaista nešto govori.`,
        worksheet: {
          title: "Radni list 8.1 — Plan za 12 mjeseci",
          questions: [
            "Koje tri brojke pratiš i kojeg datuma u mjesecu?",
            "Koji je tvoj cilj za rezervu za 12 mjeseci?",
            "Koji dug želiš da nestane i do kada?",
            "Šta radiš kad mjesec bude loš?",
            "Ko je tvoja osoba s kojom ćeš jednom mjesečno pričati o ovome?",
          ],
        },
      },
      {
        title: "Šta radiš kad mjesec bude loš",
        duration_min: 9,
        body: `Loš mjesec će doći. Ne dva puta u životu — dva do tri puta godišnje. Ako plan to ne predviđa, plan nije gotov.

Napiši unaprijed tri koraka koje radiš u lošem mjesecu:

**Prvi:** šta pauziraš. Obično su to uplate u investicije i dio "prostora za život". Ne rezerva, ne minimalne rate.
**Drugi:** šta ne diraš ni pod koju cijenu.
**Treći:** kad se vraćaš na normalno i po kojem znaku.

Ključno je da ovo napišeš **sada**, dok ti je glava bistra. U lošem mjesecu nećeš praviti dobar plan; samo ćeš izvršiti onaj koji već imaš.

I jedno podsjećanje: loš mjesec nije dokaz da plan ne radi. Plan koji predviđa loš mjesec upravo tada i radi.`,
      },
      {
        title: "Kako da ti ovo ostane nakon programa",
        duration_min: 12,
        body: `Osam sedmica je dovoljno da se nešto promijeni i premalo da se navika učvrsti. Zato zadnja lekcija nije o novcu nego o održavanju.

Tri stvari koje pomažu, poredane po učinku:

**Datum u kalendaru.** Isti dan svakog mjeseca, podsjetnik, deset minuta, tri brojke. Ako nije u kalendaru, neće se desiti.

**Jedna osoba.** Prijateljica, sestra, neko iz ove grupe. Jednom mjesečno pošalješ joj tri brojke, ona tebi svoje. Bez savjeta, samo brojke. Ovo je najefikasnija stvar u cijelom programu i najmanje je popularna.

**Jedan papir na vidljivom mjestu.** Ne aplikacija. Papir. Iznos rezerve koji ciljaš i datum do kojeg ga želiš.

Za kraj: cilj nije da postaneš osoba koja stalno misli o novcu. Cilj je suprotan — da novac zauzima deset minuta mjesečno i ostatak vremena te pusti na miru.`,
      },
    ],
    assignment: {
      title: "Plan za 12 mjeseci na jednom papiru",
      instructions: `Napiši svoj plan za 12 mjeseci. Mora stati na jednu stranicu.

Sadrži:
1. **Tri brojke** koje pratiš i datum u mjesecu kad ih upisuješ
2. **Cilj rezerve** za 12 mjeseci i mjesečni iznos
3. **Plan za loš mjesec** — šta pauziraš, šta ne diraš, kad se vraćaš
4. **Ime osobe** s kojom razmjenjuješ tri brojke jednom mjesečno

Ovo je zadnji zadatak u programu. Uzmi si vremena.`,
    },
  },
];
