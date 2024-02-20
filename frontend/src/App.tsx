import "./App.css";
import Left from "./components/left/Left";
import Calendar from "./components/left/calendar/Calendar";
import Clock from "./components/left/clock/Clock";
import ImportantDate from "./components/left/importantdate/ImportantDate";
import Infotext from "./components/left/infotext/Infotext";
import Moons from "./components/left/moons/Moons";
import Modal from "./components/modal/Modal";
import Right from "./components/right/Right";
import Gunes from "./components/right/gunes/Gunes";
import Imsak from "./components/right/imsak/Imsak";
import Ogle from "./components/right/ogle/Ogle";
import Ikindi from "./components/right/ikindi/Ikindi";
import Aksam from "./components/right/aksam/Aksam";
import Yatsi from "./components/right/yatsi/Yatsi";

function App() {
    return (
        <>
            <Modal />
            <Left>
                <Moons />
                <Calendar />
                <Clock />
                <Infotext />
                <ImportantDate />
            </Left>
            <Right>
                <Imsak />
                <Gunes />
                <Ogle />
                <Ikindi />
                <Aksam />
                <Yatsi />
            </Right>
        </>
    );
}

export default App;
