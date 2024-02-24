import { useEffect, useState } from "react";
import "./Clock.css";

function Clock() {
    const [time, setTime] = useState({ hours: "", minutes: ""});

    useEffect(() => {
        const formatTime = (unit: number) => (unit < 10 ? "0" : "") + unit;

        const updateClock = () => {
            const now = new Date();
            const hours = formatTime(now.getHours());
            const minutes = formatTime(now.getMinutes());

            setTime({ hours, minutes});
        };

        const interval = 1000;
        const timerId = setInterval(updateClock, interval);

        updateClock();

        return () => clearInterval(timerId);
    }, []);

    return (
        <>
            <div className="l-3">
                <div className="l-3-timecontainer">
                    <div className="l-3-1">{time.hours}</div>
                    <div className="l-3-2">:</div>
                    <div className="l-3-3">{time.minutes}</div>
                </div>

                <svg
                    className="seperator"
                    width="90%"
                    height="200"
                    viewBox="-42 6 100 100"
                    preserveAspectRatio="none"
                    style={{ display: "block", margin: "auto" }}
                >
                    <path d="M8 7 L57 8 L8 9 T -41 8 L8 7" fill="#1f4e5f" />
                </svg>

                <div className="timeLeft">
                    <span className="timeLeft-before"></span>
                    <span className="timeLeft-after">
                        <span className="countdown-hour"></span>
                        <span className="timeMiddle"> : </span>
                        <span className="countdown-minute"></span>
                    </span>
                </div>
            </div>
        </>
    );
}

export default Clock;