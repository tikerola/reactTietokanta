import React, {useState, useEffect} from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { Switch } from 'react-router';

import Header from './Header';
import Data from './Data';
import PrintAll from './PrintAll';
import Success from './Success';
import Error from './Error';
import splitQueries from '../functions/splitQueries';



const Query = ({queryPressed, setQueryPressed}) => {
    const [info, setInfo] = useState([])

    const handleSubmit = (e) => {
        e.preventDefault();

        if (e.target.query.value) {

            const arr = splitQueries(e.target.query.value);

            fetch('http://localhost:3001/query', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ string: arr })
            }).then(result => result.json())
            .then(result => {
                setInfo(result);
            })
            .catch(error => {
                console.log(error);
            });
        }
    };

    useEffect(() => {
        if (queryPressed) {
            setQueryPressed(false);
            setInfo([]);
        }
    });

    return (
        <div>
            {info.length === 0 ? <form onSubmit={handleSubmit}>
                <textarea name="query" className="textarea w3-card-4" rows="8" cols="80" />
                <p><button type="submit" className="w3-button w3-hover-blue w3-card-4 submit">Send</button></p>
            </form> : (info[0] === -1 ? <Error error={info[1]} /> : ( info[0] === true ? <Success /> : <PrintAll info={info} />))}
        </div>
    );
};


const Print = () => {

    const [printData, setPrintData] = useState([]);

    useEffect(() => {
        
        fetch('http://localhost:3001/printAll', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
        .then(result => result.json())
        .then(result => setPrintData(result))
        .catch(error => console.log(error));

    }, []);


    return (
        <div>
            {printData && <Data info={printData} />}
        </div>
    );
};

const Welcome = () => {
    return (
        <div className="success">
            <h1>Welcome!</h1>          
        </div>
    );
}

const Menu = ({setConnected}) => {

    const [queryPressed, setQueryPressed] = useState(false);

    const handleOnClick = () => setQueryPressed(!queryPressed);

    const handleConnected = () => setConnected(false);
    
    return (
        <BrowserRouter>
        <div>
            <Header handleOnClick={handleOnClick} handleConnected={handleConnected}/>
            <Switch>
                <Route path="/query" render={() => <Query queryPressed={queryPressed} setQueryPressed={setQueryPressed} />} exact={true} />
                <Route path="/connect" component={Welcome} />
                <Route path="/print" component={Print} />
            </Switch>
        </div>
        </BrowserRouter>
    );
};

export default Menu;