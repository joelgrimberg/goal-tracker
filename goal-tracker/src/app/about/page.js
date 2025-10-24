"use client";

import { useState, useEffect, useMemo } from "react";
import { FaEnvelope, FaTwitter, FaLinkedin, FaBuilding } from "react-icons/fa"; // Import icons from react-icons
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function DeveloperInfoPage() {
  const [selectedRow, setSelectedRow] = useState(-1);
  const router = useRouter(); // Initialize the router for navigation

  const developerInfo = useMemo(
    () => [
      { label: "Name", value: "Joël Grimberg" },
      {
        label: "Email",
        value: "joel@joelgrimberg.nl",
        type: "email",
        icon: <FaEnvelope className="h-5 w-5 text-blue-500" />,
      },
      {
        label: "Twitter",
        value: "https://twitter.com/joelgrimberg",
        type: "link",
        icon: <FaTwitter className="h-5 w-5 text-blue-400" />,
      },
      {
        label: "LinkedIn",
        value: "https://linkedin.com/in/joelgrimberg",
        type: "link",
        icon: <FaLinkedin className="h-5 w-5 text-blue-700" />,
      },
      {
        label: "Company",
        value: "GrimbergIT",
        icon: <FaBuilding className="h-5 w-5 text-gray-600" />,
      },
    ],
    [],
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown" || event.key === "j") {
        setSelectedRow((prev) =>
          prev < developerInfo.length - 1 ? prev + 1 : 0,
        );
      } else if (event.key === "ArrowUp" || event.key === "k") {
        setSelectedRow((prev) =>
          prev > 0 ? prev - 1 : developerInfo.length - 1,
        );
      } else if (event.key === "Enter" && selectedRow !== -1) {
        const selectedItem = developerInfo[selectedRow];
        if (selectedItem.type === "link") {
          window.open(selectedItem.value, "_blank");
        } else if (selectedItem.type === "email") {
          window.location.href = `mailto:${selectedItem.value}`;
        }
      } else if (event.key === "Escape") {
        router.push("/"); // Navigate back to the home page
      } else if (event.key === "e") {
        const emailItem = developerInfo.find((item) => item.type === "email");
        if (emailItem) {
          window.location.href = `mailto:${emailItem.value}`;
        }
      } else if (event.key === "t") {
        const twitterItem = developerInfo.find(
          (item) => item.label === "Twitter",
        );
        if (twitterItem) {
          window.open(twitterItem.value, "_blank");
        }
      } else if (event.key === "l") {
        const linkedInItem = developerInfo.find(
          (item) => item.label === "LinkedIn",
        );
        if (linkedInItem) {
          window.open(linkedInItem.value, "_blank");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedRow, developerInfo, router]);

  return (
    <div>
      <main className="pt-16">
        <section id="developer-info">
          <table
            className="table-width"
            role="grid"
            aria-label="Developer Information"
          >
            <tbody>
              <tr>
                <td style={{ padding: 0, verticalAlign: 'top' }}>
                  <table style={{ width: '100%', border: 'none' }}>
                    <tbody style={{ border: 'none' }}>
                      {developerInfo.map((info, index) => (
                        <tr
                          key={index}
                          role="row"
                          className={selectedRow === index ? "highlight" : ""}
                          onMouseEnter={() => setSelectedRow(index)}
                          aria-selected={selectedRow === index}
                          tabIndex={0}
                          onFocus={() => setSelectedRow(index)}
                        >
                          <td role="gridcell">
                            {info.type === "link" ||
                            info.type === "email" ||
                            info.icon ? (
                              <a
                                href={
                                  info.type === "email"
                                    ? `mailto:${info.value}`
                                    : info.type === "link"
                                      ? info.value
                                      : undefined
                                }
                                target={info.type === "link" ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                className="goal-link flex items-center space-x-2"
                                aria-label={info.label}
                              >
                                {info.icon}
                                <span>{info.value}</span>
                              </a>
                            ) : (
                              info.value
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td style={{ padding: 0, margin: 0, verticalAlign: 'top', textAlign: 'right', width: '192px' }}>
                  <img
                    src="/me.jpg"
                    alt="Joel Grimberg"
                    style={{ width: '100%', height: 'auto', display: 'block', margin: 0, padding: 0 }}
                  />
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2" className="info-box">
                  <p>
                    <kbd>j</kbd>/<kbd>↓</kbd> down <br />
                    <kbd>k</kbd>/<kbd>↑</kbd> up <br />
                    <kbd>Enter</kbd> select <br />
                    <kbd>Esc</kbd> go back <br />
                  </p>
                </td>
                <td className="info-box">
                  <p>
                    <kbd>e</kbd> email <br />
                    <kbd>t</kbd> Twitter <br />
                    <kbd>l</kbd> LinkedIn <br />
                  </p>
                </td>
              </tr>
            </tfoot>
          </table>
        </section>
      </main>
    </div>
  );
}
