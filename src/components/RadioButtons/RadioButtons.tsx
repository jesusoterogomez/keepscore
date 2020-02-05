import React from 'react';

type Props = {
    options: {
        label: string;
        value: string;
    }[];
    value: string;
    onChange: any;
};

const RadioButtons: React.FC<Props> = props => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        props.onChange(value);
    };

    return (
        <div className="radio-buttons">
            {props.options.map(option => (
                <label key={option.value}>
                    <input
                        type="radio"
                        value={option.value}
                        checked={option.value === props.value}
                        onChange={handleChange}
                    />
                    {option.label}
                </label>
            ))}
        </div>
    );
};

export default RadioButtons;
