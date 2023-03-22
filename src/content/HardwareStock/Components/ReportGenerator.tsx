import {
  Image,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf
} from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import atLogo from 'public/at_logo.png';

const reportProps = {
  data: PropTypes.object,
  user: PropTypes.object
};

type ReportProps = PropTypes.InferProps<typeof reportProps>;

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },

  companyInfo: {
    flexDirection: 'column',
    gap: '6px',
    fontSize: '9px'
  },
  table: {
    width: '100%',
    fontSize: '13px'
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  header: {
    borderTop: '2px solid black'
  },
  bold: {
    fontWeight: 'bold'
  },

  row1: {
    width: '5%',
    borderLeft: '2px solid black',
    borderRight: '2px solid black',
    borderBottom: '2px solid black',
    paddingLeft: '2px',
    fontSize: '11px'
  },
  row2: {
    width: '25%',
    borderRight: '2px solid black',
    borderBottom: '2px solid black',
    paddingLeft: '2px',
    fontSize: '11px'
  },
  row3: {
    width: '25%',
    borderRight: '2px solid black',
    borderBottom: '2px solid black',
    paddingLeft: '2px',
    fontSize: '11px'
  },
  row4: {
    width: '25%',
    borderRight: '2px solid black',
    borderBottom: '2px solid black',
    paddingLeft: '2px',
    fontSize: '11px'
  },
  row5: {
    width: '25%',
    borderRight: '2px solid black',
    borderBottom: '2px solid black',
    paddingLeft: '2px',
    fontSize: '11px'
  }
});

const Report = ({ data, user }: ReportProps) => {
  const date = new Date();
  return (
    <Document>
      <Page size={'A4'}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            margin: '10px 35px 0px 35px'
            // marginRight: '35px'
          }}
        >
          <div
            style={[
              styles.companyInfo,
              { display: 'flex', flexDirection: 'column' }
            ]}
          >
            <Text style={{ fontWeight: 'bold' }}>AdminTools S.R.L.</Text>
            <Text style={{ fontWeight: 'bold' }}>CUI: RO33431948</Text>
            <Text>Blvd. Mamaia nr. 288, Hotel Turist, Birou 17</Text>
            <Text>Constanta, Cod Postal 900552</Text>
            <Text>Tel: 0764918102</Text>
            <Text>Email: support@admintools.io</Text>
          </div>
          <Image style={{ height: '70px', width: '100px' }} src={atLogo} />
        </View>
        <View
          style={{
            display: 'flex',
            margin: '10px 50px 0px 50px',
            flexDirection: 'column',
            padding: '0px 0px 10px 0px '
          }}
        >
          <View style={{ borderBottom: '1px solid black' }}></View>

          <Text
            style={{
              fontWeight: 'extrabold',
              fontSize: '13px',
              marginTop: '20px'
            }}
          >
            PROCES VERBAL DE PREDARE PRIMIRE
          </Text>
          <Text
            style={{
              fontWeight: 'extrabold',
              fontSize: '13px',
              marginTop: '10px'
            }}
          >
            Numarul …………... data ………............. (numit in continuare "Procesul
            Verbal)
          </Text>
          <View
            style={{ borderBottom: '1px solid black', marginTop: '20px' }}
          ></View>
          <Text
            style={{
              fontSize: '13px',
              fontWeight: 'normal',
              marginTop: '10px'
            }}
          >
            prin care Admin Tools S.R.L, reprezentata prin {user.first_name}{' '}
            {user.last_name} preda urmatoarele echipamente (denumite în
            continuare "Pachet de Echipamente"):
          </Text>
        </View>

        <View style={{ margin: '20px 50px 0 50px' }}>
          <View style={styles.table}>
            <View style={[styles.row, styles.bold, styles.header]}>
              <Text style={styles.row1}>Nr</Text>
              <Text style={styles.row2}>Brand</Text>
              <Text style={styles.row3}>Model</Text>
              <Text style={styles.row4}>S/N</Text>
              <Text style={styles.row5}>Adresa MAC</Text>
            </View>
            <View style={styles.row} wrap={false}>
              <Text style={styles.row1}>
                <Text style={styles.bold}> 1</Text>
              </Text>
              <Text style={styles.row2}> {data.brand} </Text>
              <Text style={styles.row3}> {data.model} </Text>
              <Text style={styles.row4}>
                <Text style={styles.bold}> {data.serial_number} </Text>
              </Text>
              <Text style={styles.row5}> {data.mac_address} </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            margin: '20px 50px 0 50px'
          }}
        >
          <Text style={{ fontSize: '13px' }}>
            {'Echipamentele sunt instalate în locatia: '}
          </Text>
          <Text style={{ fontSize: '13px' }}>
            {
              'Strada ……………………………………………………………..…, Oras: ……………… , Judet …………………………. '
            }
          </Text>
          <Text style={{ fontSize: '13px', marginTop: '15px' }}>
            {
              'Persoana de contact din locatie (denumită în continuare “Client”:'
            }
          </Text>
          <Text style={{ fontSize: '13px', marginTop: '5px' }}>{'Nume:'}</Text>
          <Text style={{ fontSize: '13px', marginTop: '5px' }}>
            {'Numar de telefon'}
          </Text>
          <Text style={{ fontSize: '13px', marginTop: '5px' }}>
            {'Adresa de email:'}
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              // marginLeft: '40px',
              marginTop: '30px'
            }}
          >
            <Text style={{ fontSize: '13px' }}>
              Clientul declara faptul ca a primit Echipamentele în stare
              perfecta de functionare și agreeaza următoarele conditii ce vor
              guverna regimul juridic al acestora:
            </Text>
            <Text
              style={{
                fontSize: '13px',
                marginLeft: '20px',
                marginTop: '10px'
              }}
            >
              1.AdminTools SRL detine dreptul de proprietate exclusiva asupra
              Echipamentelor.
            </Text>
            <Text style={{ fontSize: '13px', marginLeft: '20px' }}>
              2. Pachetul de Echipamente este predat clientului în custodie.
            </Text>
            <Text style={{ fontSize: '13px', marginLeft: '20px' }}>
              3. Clientul are urmatoarele obligatii:
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '15px'
            }}
          >
            <Text style={{ fontSize: '13px' }}>
              {
                'a) sa pastreze in bune conditii echipamentele Admin Tools primite in custodie si cu respectarea drepturilor Admin Tools SRL;'
              }
            </Text>
            <Text style={{ fontSize: '13px' }}>
              {
                'b) sa asigure integritatea echipamentelor Admin Tools ce i s-au incredintat, sa ia masuri de conservare si de prevenire a deteriorarii sau degradarii lor;'
              }
            </Text>
            <Text style={{ fontSize: '13px' }}>
              {
                'c) sa foloseasca echipamentele Admin Tools în mod exclusiv pentru functionarea Serviciului Admin Tools;'
              }
            </Text>
            <Text style={{ fontSize: '13px' }}>
              {
                'd) sa nu instraineze cu orice titlu Echipamentele Admin Tools sau sa le greveze cu garantii reale mobiliare sau orice alte sarcini;'
              }
            </Text>
            <Text style={{ fontSize: '13px' }}>
              {
                'e) sa restituie echipamentele Admin Tools la cererea expresa formulata de Admin Tools in acest sens;'
              }
            </Text>
            <Text style={{ fontSize: '13px' }}>
              {
                'f) sa nu permita accesul persoanelor neautorizate de către Admin Tools SRL si nici interventii neautorizate la Echipamentele Admin Tools, recunoscand ca acesta este singurul autorizat pentru orice interventii la aceste Echipamente. Clientul va permite accesul neconditionat Admin Tools SRL si persoanelor autorizate de acesta în locatiile sale pentru efectuarea de lucrări de instalare, demontare, intretinere, inlocuire și modernizare a Echipamentelor sau pentru orice alte lucrări care sunt necesare pentru buna functionare a Serviciului Admin Tools. '
              }
            </Text>
          </View>
        </View>
      </Page>
      <Page size="A4">
        <View
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            margin: '10px 35px 0px 35px'
            // marginRight: '35px'
          }}
        >
          <div
            style={[
              styles.companyInfo,
              { display: 'flex', flexDirection: 'column' }
            ]}
          >
            <Text style={{ fontWeight: 'bold' }}>AdminTools S.R.L.</Text>
            <Text>Blvd. Mamaia nr. 288</Text>
            <Text>Constanta, cod postal 900263</Text>
            <Text>Tel: 0772324241</Text>
            <Text>Email: support@admintools.io</Text>
          </div>

          <Image style={{ height: '70px', width: '100px' }} src={atLogo} />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            margin: '20px 50px 0 50px'
          }}
        >
          <Text style={{ fontSize: '13px' }}>
            {
              'g) sa aducă la cunostinta Admin Tools SRL cazurile de deteriorare, uzura, desigilare, furt sau pierdere sau orice alta actiune impotriva Echipamentelor Admin Tools in cel mai scurt timp posibil dar nu mai tarziu de 24 (douazeci si patru) de ore de la producerea evenimentului'
            }
          </Text>
          <Text style={{ fontSize: '13px', marginLeft: '20px' }}>
            4. Admin Tools SRL are urmatoarea obligatie:
          </Text>
          <Text style={{ fontSize: '13px' }}>
            {
              'a) sa furnizeze Echipamentele Clientului si sa ofere Clientului informatii si instrucțiuni cu privire la corecta functionare a Echipamentelor;'
            }
          </Text>
          <Text style={{ fontSize: '13px', marginTop: '15px' }}>
            {
              'Acest proces verbal a fost incheiat astazi, ................... in ........................, in doua exemplare originale, cate unul pentru fiecare parte.'
            }
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',

              marginTop: '20px'
            }}
          >
            <Text style={{ fontSize: '13px' }}>AdminTools S.R.L.</Text>
            <Text style={{ fontSize: '13px', marginLeft: '10px' }}>
              ......................
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',

              marginTop: '20px'
            }}
          >
            <Text style={{ fontSize: '13px' }}>......................</Text>
            <Text style={{ fontSize: '13px', marginLeft: '10px' }}>
              ......................
            </Text>
          </View>
        </View>
      </Page>
      {/* <Page size="A4">
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            margin: '20px 50px 0 50px'
          }}
        >
          <Text style={{ fontSize: '13px' }}>
            Echipamentele AdminTools in starea in care i-au fost predate mai
            putin uzura normala,, incheind in acest sens un Proces Verbal de
            predare primire cu AdminTools in care se vor mentiona
            caracteristicel tehnice ale Pachetului de Echipamente predat, starea
            in care este returnat catre AdminTools precum si eventualele
            despagubiri pe care Clientul este obligat sa le acorde AdminTools in
            cazul in care Echipamentele sunt predate in stare deteriorata,
            nefunctionala total sau partial, suferind interventii neautorizate
            sau prezentand orice alte semne de neconformitate;
          </Text>
          <Text style={{ fontSize: '13px' }}>
            {
              'f) sa nu permita accesul persoanelor neautorizate de catre AdminTools Romania si nici interventii neautorizate la Echipamentele AdminTools, recunoscand ca acesta este singurul autorizat pentru orice  interventii  la  aceste  Echipamente.  Clientul  va  permite  accesul  neconditionat  AdminTools Romania  si  persoanelor  autorizate  de  acesta  in  locatiile  sale  pentru  efectuarea  de  lucrari  de instalare, demontare, intretinere, inlocuire si modernizare a Echipamentelor sau pentru orice alte  lucrari  care  sunt  necesare  pentru  buna  functionare  a  Serviciului  AdminTools.  Clientul intelege prin semnarea prezentei Anexe ca AdminTools Romania este exonerat de orice raspundere privind intreruperea furnizarii Serviciului AdminTools in cazul refuzului Clientului de a permite accesul la Echipamentele AdminTools. In cazul  in care Clientul efectueaza orice operatiune  cu  privire  la  Echipamentele  AdminTools  prin  terte  parti,  neautorizate  de  catre AdminTools,  AdminTools  este  indreptatit  sa  rezilieze  Contractul,  fara  preaviz  sau  termen  de remediere,  fara  interventia  instantei  de  judecata  si  fara  indeplinirea  vreunei  alte  formalitati prealabile, cu aplicarea daunelor interese; '
              //   g) sa asigure intretinerea, conservarea si integritatea Echipamentelor AdminTools si sa ia masuri
              //   pentru prevenirea furtului, pierderii sau deteriorarii acestuia;
            }
          </Text>
          <Text style={{ fontSize: '13px' }}>
            {
              '  g) sa asigure intretinerea, conservarea si integritatea Echipamentelor AdminTools si sa ia masuri pentru prevenirea furtului, pierderii sau deteriorarii acestuia;'
            }
          </Text>
          <Text style={{ fontSize: '13px' }}>
            {
              '  h) sa aduca la cunostinta AdminTools Romania cazurile de deteriorare, uzura, desigilare, furt sau pierdere sau orice alta actiune impotriva Echipamentelor AdminTools in cel mai scurt timp posibil dar nu mai tarziu de 24 (douazecisipatru) de ore de la producerea evenimentului;'
            }
          </Text>
          <Text style={{ fontSize: '13px' }}>
            i) in cazul in care Echipamentele AdminTools instalate in locatiile
            Clientului au fost desigilate, deteriorate, distruse, pierdute sau
            furate, Clientul va despagubi AdminTools Romania la valoarea
            integrala a pagubelor provocate pe baza facturii fiscale emise in
            acest scop de catre AdminTools Romania;
          </Text>
          <Text style={{ fontSize: '13px' }}>
            j) sa suporte cheltuielile ocazionate de functionarea Echipamentelor
            AdminTools incluzand energia electrica consumata de acestea.
          </Text>
          <Text style={{ fontSize: '13px' }}>
            k) sa achite cu respectarea conditiilor Contractuale taxele aferente
            prestarii Serviciului Eurovoice conform prevederilor Contractuale si
            Anexei 2 la Contract.
          </Text>
          <Text
            style={{ fontSize: '13px', marginLeft: '40px', marginTop: '2px' }}
          >
            4. AdminTools Romania are urmatoarele obligatii:
          </Text>
          <Text
            style={{ fontSize: '13px', marginLeft: '20px', marginTop: '2px' }}
          >
            a) sa furnizeze Echipamentele Clientului pentru indeplinirea
            obiectului Contractului si sa ofere Clientului informatii si
            instructiuni cu privire la corecta functionare a Echipamentelor;
          </Text>
          <Text
            style={{ fontSize: '13px', marginLeft: '20px', marginTop: '2px' }}
          >
            b) sa ridice in termen de [0] zile Echipamentele AdminTools predate
            de catre Client la incetarea Contractului.
          </Text>
          <Text style={{ fontSize: '13px' }}>
            In caz de nereturnare de catre CLIENT a Echipamentelor AdminTools in
            termen de cel mult 10 zile de la incetarea Contractului indiferent
            de motiv sau de la data cererii emise de AdminTools ROMANIA, acesta
            va fi obligat la plata de despagubiri catre AdminTools ROMANIA in
            cuantum de 0,5% pe zi de intarziere calculate asupra valorii totale
            a Echipamentelor nereturnate, valoarea penalitatilor putand depasi
            valoarea sumei datorate.
          </Text>

          <Text style={{ fontSize: '13px', marginTop: '10px' }}>
            Acest proces verbal a fost incheiat astazi, ................... in
            ........................, in doua exemplare originale, cate unul
            pentru fiecare parte.
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: '20px'
            }}
          >
            <Text style={{ fontSize: '13px' }}>AdminTools S.R.L.</Text>
            <Text style={{ fontSize: '13px' }}>......................</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: '20px'
            }}
          >
            <Text style={{ fontSize: '13px' }}>......................</Text>
            <Text style={{ fontSize: '13px' }}>......................</Text>
          </View>
        </View>
      </Page> */}
    </Document>
  );
};

const generateReport = async (data, user) => {
  // return <Report data={data} user={user} />;
  const blob = await pdf(<Report data={data} user={user} />).toBlob();
  return blob;
};

Report.propTypes = reportProps;

export default generateReport;
