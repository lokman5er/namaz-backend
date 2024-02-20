import "./Gunes.css";

function Gunes() {
    return (
        <>
            <svg
                id="gunes"
                className="gunes"
                data-name="gunes"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 775.92 230"
            >
                <defs>
                    <style id="style">
                        {`   @import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900");
                            @font-face {
                                font - family: "Hafs";
                            src: url("hafs.otf");
                            fontWeight: normal;
                        }
                            .cls-1 {
                                fill: #2c7291;
                        }

                            .cls-2 {
                                fill: url(#linear-gradient);
                        }

                            .cls-3 {
                                fill: url(#linear-gradient-2);
                        }

                            .cls-4 {
                                fill: #1f5260;
                        }
                         `}
                    </style>
                    <linearGradient
                        id="linear-gradient"
                        x1="-1629.12"
                        y1="-2477.87"
                        x2="-1629.21"
                        y2="-2254.93"
                        gradientTransform="translate(3130.38 1105.3) rotate(-36.02)"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#083640" />
                        <stop
                            offset="0.81"
                            stopColor="#083640"
                            stopOpacity="0"
                        />
                    </linearGradient>
                    <linearGradient
                        id="linear-gradient-2"
                        x1="294.13"
                        y1="63.37"
                        x2="427.86"
                        y2="140.58"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop id="stop1" offset="0" stopColor="#2c7291" />
                        <stop id="stop2" offset="1" stopColor="#1f5260" />
                    </linearGradient>
                </defs>
                <rect
                    id="s1"
                    fill="#2c7291"
                    x="386.98"
                    y="49.04"
                    width="388.94"
                    height="108.21"
                />
                <path
                    id="s2"
                    fill="url(#linear-gradient)"
                    d="M431,71.33h0A54.11,54.11,0,0,0,343.5,135h0l91.2,142.42L538.39,202Z"
                />
                <path
                    id="s3"
                    fill="url(#linear-gradient-2)"
                    d="M413.52,56h0l-.23-.13-1-.54L325.94,8.27l-48.79,121.6,96.32,25.69h0a54.12,54.12,0,0,0,40-99.56Z"
                />
                <path
                    id="s4"
                    fill="#1f5260"
                    d="M277.15,129.87,325.27,9.94A65.77,65.77,0,0,0,297.92,4H70a66,66,0,0,0,0,132H297.92c.7,0,1.39,0,2.09-.05Z"
                />
                <path
                    id="s1"
                    fill="#2c7291"
                    d="M293.92,0H66a66,66,0,0,0,0,132H293.92a66,66,0,0,0,0-132Z"
                />
                <text
                    id="tr"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    x="180"
                    y="74"
                    fontSize="1.2em"
                    fill="white"
                    fontWeight="bold"
                    className="text"
                    letterSpacing="normal"
                    opacity="1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    GÜNEŞ
                </text>
                <text
                    id="ar"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    x="180"
                    y="74"
                    fontSize="1.2em"
                    fill="white"
                    fontWeight="bold"
                    className="text"
                    letterSpacing="normal"
                    opacity="0"
                    style={{ fontFamily: "Hafs" }}
                >
                    الأيام الدينة
                </text>
                <text
                    id="de"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    x="180"
                    y="74"
                    fontSize="0.9em"
                    fill="white"
                    fontWeight="bold"
                    className="text"
                    letterSpacing="normal"
                    opacity="0"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    SONNENA.
                </text>
                <text
                    textAnchor="middle"
                    x="535"
                    y="128"
                    fontSize="1.2em"
                    fill="white"
                    fontWeight="normal"
                    className="hour1 time"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    0
                </text>
                <text
                    textAnchor="middle"
                    x="582"
                    y="128"
                    fontSize="1.2em"
                    fill="white"
                    fontWeight="normal"
                    className="hour2 time"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    0
                </text>
                <text
                    x="610"
                    y="123"
                    fontSize="1.2em"
                    fill="white"
                    fontWeight="normal"
                    className="time"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    :
                </text>
                <text
                    textAnchor="middle"
                    x="653"
                    y="128"
                    fontSize="1.2em"
                    fill="white"
                    fontWeight="normal"
                    className="minute1 time"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    0
                </text>
                <text
                    textAnchor="middle"
                    x="701"
                    y="128"
                    fontSize="1.2em"
                    fill="white"
                    fontWeight="normal"
                    className="minute2 time"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                    0
                </text>
            </svg>
        </>
    );
}

export default Gunes;
