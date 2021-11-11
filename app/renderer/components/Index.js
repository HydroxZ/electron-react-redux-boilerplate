import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
var CronJob = require('cron').CronJob;

const { spawn } = require('child_process');
let bus = require('../../events/eventBus');

// using fs module to read file
function fsRead(file_path) {
  let fs = require('fs');
  var path = require('path');

  var path_finale = path.join(__dirname, file_path);
  console.log(path_finale);
  let file = fs.readFileSync(path_finale, 'utf8');
  return file;
}
const readGruppi = (path) => {
  // get absolute path
  let file = fsRead(path);
  let lines = file.split('\n');
  let listaGruppi = [];
  lines.forEach((line) => {
    let values = line.split(',');
    // trim whitespace
    values = values.map((value) => value.trim());
    // check if id is not empty
    if (values[0] !== '') {
      let gruppo = {
        id: values[0],
        orario: values[1],
        messaggio: values[2],
      };
      listaGruppi.push(gruppo);
    }
  });

  return listaGruppi;
};
// having relative path to file, get absolute path
function Modal(props) {
  return (
    <div className={`${props.modal ? 'modal' : 'hidden'}`}>
      <div className="modal-content">
        <div className="modal-header">
          <span className="close" onClick={props.onCancel}>
            &times;
          </span>
          <h2>Richiesta codice</h2>
        </div>
        <div className="modal-body">
          <p>Inserisci il codice ricevuto da Telegram</p>
          <input
            onChange={(e) => {
              props.setCodice(e.target.value);
            }}
            type="text"
          />
          <button onClick={props.onOk}>Ok</button>
        </div>
      </div>
    </div>
  );
}

export const Admin = (props) => {
  let listaCronJobs = [];
  let listaAccount = [
    {
      username: 'gianpaolo',
      id: 1,
      api_id: '1345219',
      api_hash: '7c508c4d284f5896c21dba817dcef23a',
      phone_number: '+393381344919',
    },
  ];
  // create modal
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codice, setCodice] = useState('');
  const [currentProcess, setCurrentProcess] = useState('');
  const onOk = () => {
    setLoading(true);
    // find nodejs process
    bus.emit('CodiceInviato', codice);
  };
  const onCancel = () => {
    setModal(false);
  };
  // read .csv file

  let handleClick = (account) => {
    // execute existing python script
    const pythonProcess = spawn(
      'python',
      [
        './python_files/change_username.py',
        account.username,
        account.api_id,
        account.api_hash,
        account.phone_number,
      ],
      {
        shell: true,
      },
    );

    pythonProcess.stdout.on('data', (data) => {
      console.log(data.toString());
      processLogin(data, pythonProcess, account, setModal, bus);
    });
    pythonProcess.stderr.on('data', (data) => {
      console.log(data.toString());
    });
  };
  return (
    <>
      <div>
        <Modal modal={modal} setCodice={setCodice} onOk={onOk} onCancel={onCancel}></Modal>
        <div className="grigliaAccount">
          <div>Username</div>
          <div>API ID</div>
          <div>API HASH</div>
          <div>Actions</div>
        </div>
        {listaAccount.map((account) => (
          <div className="grigliaAccount" key={account.id}>
            <p
              onClick={() => {
                handleClick(account);
              }}>
              {account.username}
            </p>
            <p>{account.api_id}</p>
            <p>{account.api_hash}</p>
            <button
              onClick={(e) => {
                let gruppi = readGruppi('../../settings/gruppi.csv');

                console.log(gruppi);
                // having time and message, schedule a job
                gruppi.forEach((gruppo) => {
                  let job = new CronJob(
                    gruppo.orario,
                    () => {
                      let write_to_group = spawn(
                        'python',
                        [
                          './python_files/write_to_group.py',
                          account.api_id,
                          account.api_hash,
                          account.phone_number,
                          gruppo.id,
                          gruppo.messaggio,
                        ],
                        {
                          shell: true,
                          // kill process if it takes more than 10 seconds
                          timeout: 10000,
                        },
                      );
                      write_to_group.stdout.on('data', (data) => {
                        processLogin(data, write_to_group, account, setModal, bus);
                        console.log(data.toString());
                      });
                      write_to_group.stderr.on('data', (data) => {
                        console.log(data.toString());
                        // close process
                        write_to_group.kill();
                      });
                    },
                    null,
                    true,
                    'Europe/Rome',
                  );
                  console.log(job);
                });
              }}>
              Inizia
            </button>
          </div>
        ))}
        <style jsx>{`
          body {
            background: #fafafa;
          }
          .grigliaAccount {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-gap: 10px;
          }
          .hidden {
            display: none;
          }
          .modal-content {
            background: #fefefe;
            border: 1px solid #888;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
          }
          .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    </>
  );
};

Admin.propTypes = {
  props: PropTypes,
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);

function processLogin(data, pythonProcess, account, setModal, bus) {
  if (data.toString().indexOf('Please enter your phone') >= 0) {
    // send code to process
    pythonProcess.stdin.write(account.phone_number + '\n');
    setModal(true);
  } else if (data.toString().indexOf('Logged in as') >= 0) {
    // send code to process
    //  pythonProcess.kill();
  }
  bus.on('CodiceInviato', (data) => {
    pythonProcess.stdin.write(data + '\n');
  });
}
