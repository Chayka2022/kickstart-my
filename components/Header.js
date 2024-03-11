import React from 'react';
import {Menu} from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
    return (
        <Menu style={{ marginTop: '10px' }}>
            <Link route="/">
                <href className="item"> CrowdCoin  </href>
            </Link>

            <Menu.Menu position='right'>
                <Link route="/">
                    <href className="item">Campaigns</href>
                </Link>

                <Link route="/campaigns/new">
                    <href className="item"> + </href>
                </Link>
            </Menu.Menu>
        </Menu>
    );
};