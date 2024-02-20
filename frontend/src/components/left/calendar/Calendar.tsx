import "./Calendar.css";

function Calendar() {
    return (
        <>
            <div className="l-2">
                <div className="l-2-1">
                    <strong className="dateNormal">20</strong>
                    <span>.</span>
                    <div className="monthNormal">04</div>
                    <span>.</span>
                    <strong className="yearNormal">571</strong>
                </div>
                <div className="l-2-2">
                    <strong>|</strong>
                </div>
                <div className="l-2-3">
                    <strong className="dateHicri">27</strong>
                    <span id="p1">.</span>
                    <div className="monthHicri">07</div>
                    <span id="p2">.</span>
                    <strong className="yearHicri">1400</strong>
                </div>
            </div>
        </>
    );
}

export default Calendar;
