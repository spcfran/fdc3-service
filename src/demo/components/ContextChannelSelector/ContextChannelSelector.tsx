import * as React from 'react';

import {Channel, getChannel, getAllChannels, joinChannel, GLOBAL_CHANNEL_ID, ChannelId} from '../../../client/contextChannels';

import './ContextChannelSelector.css';

interface ContextChannelSelectorProps {
    float?: boolean;
}

ContextChannelSelector.defaultProps = {
    float: false
};

/**
 * Context channel ui
*/
export function ContextChannelSelector(props: ContextChannelSelectorProps): React.ReactElement {
    const {float} = props;
    const [currentChannelId, setCurrentChannelId] = React.useState<ChannelId>(GLOBAL_CHANNEL_ID);
    const [color, setColor] = React.useState<number>(0xFFFFFF);
    const [channels, setChannels] = React.useState<Channel[]>([]);
    React.useEffect(() => {
        getChannel().then(channel => {
            setColor(channel.color);
            setCurrentChannelId(channel.id);
        });
        getAllChannels().then(channels => {
            setChannels(channels);
        });
    }, []);

    const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {value: id} = event.currentTarget;
        const selectedChannel = channels.find(channel => channel.id === id);

        try {
            await joinChannel(id);
            setCurrentChannelId(id);
            if (selectedChannel) {
                setColor(selectedChannel.color);
            }
        } catch (e) {
            // Stringifying an `Error` omits the message!
            const error: any = {
                message: e.message,
                ...e
            };
            console.error(`Unable to join channel ${id}! ${error.message}`, e);
        }
    };

    return (
        <div className={`context-channel ${float ? 'float' : ''}`}>
            <div className='selector'>
                <div className="color" style={{backgroundColor: numberToHex(color)}}></div>
                <select value={currentChannelId} onChange={handleChange}>
                    {
                        channels.map((channel, index) => {
                            return (
                                <option
                                    key={channel.id + index}
                                    value={channel.id}
                                >
                                    {channel.name}
                                </option>
                            );
                        })
                    }
                </select>
            </div>
        </div>
    );
}

/**
 *
 * @param num
 */
function numberToHex(num: number) {
    return num.toString(16).padStart(6, '0');
}
