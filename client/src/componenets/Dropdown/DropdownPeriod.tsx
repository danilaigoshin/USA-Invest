import React, { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Theme } from '../../store/interfaces';

const ConDropdown = styled.div`
  background: ${({ theme }: Theme) => theme.colors.secondary};

  padding: 0px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 18px;
  z-index: 1;
  position: relative;
  font-weight: bold;
  font-size: 0.9rem;
  min-height: 45px;

  .text {
    flex: 1;
    transition: all 0.25s ease;
  }

  span {
    margin-left: 20px;
    font-weight: bold;
    font-size: 0.9rem;
    opacity: 1;
    transition: all 0.25s ease;
    color: ${({ theme }: Theme) => theme.colors.text};
    pointer-events: none;
  }

  .text button {
    padding: 15px 8px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    transition: all 0.25s ease, padding 0.25s ease 0s;
    width: calc(100% - 20px);
    box-sizing: border-box;
    border-radius: 18px;
    border: 0px;
    cursor: pointer;
    background: transparent;
  }

  img {
    transition: all 0.25s ease;
    margin-right: 20px;
  }

  button img {
    pointer-events: none;
    height: 35px;
    max-width: 35px;
    transition: all 0.25s ease;
  }
`;

const Arrow = styled.img`
  filter: ${({ theme }: Theme) => theme.colors.logo};

  &.open {
    transform: rotate(180deg);
  }
`;

const DropdownMenu = styled.div`
  .dropdown-menu {
    background: ${({ theme }: Theme) => theme.colors.secondary};
  }

  .dropdown-menu button span {
    color: ${({ theme }: Theme) => theme.colors.text};
  }
`;

interface IProps {
  dropdownList: {
    name: string;
  }[];

  selectedItem: {
    name: string;
  };

  dropdownHandler: (item: { name: string }) => void;
}

const DropdownPeriod: FC<IProps> = ({
  dropdownList,
  selectedItem,
  dropdownHandler,
}) => {
  const dropdownEl = useRef<HTMLDivElement>(null);
  const arrowEl = useRef<HTMLImageElement>(null);

  useEffect(() => {
    document.addEventListener('click', (e) => {
      const target = e.target as Element;
      if (e.target !== null && !target.closest('.dropdown')) {
        if (dropdownEl.current !== null && arrowEl.current !== null) {
          dropdownEl.current.classList.remove('open');
          arrowEl.current.classList.remove('open');
        }
      }
    });
  }, []);

  const classToggleHandler = () => {
    if (dropdownEl.current !== null && arrowEl.current !== null) {
      dropdownEl.current.classList.toggle('open');
      arrowEl.current.classList.toggle('open');
    }
  };

  const selectHandler = (item: { name: string }) => {
    dropdownHandler(item);
    classToggleHandler();
  };

  return (
    <>
      <div ref={dropdownEl} className="dropdown">
        <ConDropdown onClick={classToggleHandler} className="con-dropdown">
          <div className="text">
            <button>
              <span>{selectedItem.name}</span>
            </button>
          </div>
          <Arrow
            ref={arrowEl}
            width="18px"
            height="18px"
            src="/Icons/chevron-down.svg"
          />
        </ConDropdown>

        <DropdownMenu>
          <div className="dropdown-menu">
            {dropdownList.map((item, index) => {
              return (
                <button onClick={() => selectHandler(item)} key={index}>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </DropdownMenu>
      </div>

      <style jsx>{`
        * {
          list-style: none;
          outline: none;
          padding: 0;
          margin: 0;
        }

        .dropdown {
          cursor: pointer;
          position: relative;
          display: block;
          width: 200px;
          margin-left: 50px;
        }

        @media (max-width: 700px) {
          .dropdown {
            margin-left: auto;
          }
        }

        .dropdown.open .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translate(0, calc(100% + 30px));
          padding-bottom: 10px;
          padding-top: 10px;
          pointer-events: auto;
        }
        .dropdown.open .dropdown-menu button {
          margin-top: 0px;
          opacity: 1;
        }
        .dropdown.open .con-dropdown img {
          transform: rotate(180deg);
        }
        .dropdown-menu {
          z-index: 1;
          position: absolute;
          border-radius: 18px;
          padding-left: 0px;
          bottom: 0px;
          width: 100%;
          opacity: 1;
          visibility: hidden;
          transition: all 0.3s ease;
          transform: translate(0, 100%);
          pointer-events: none;
        }
        .dropdown-menu button {
          padding: 15px 8px;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          margin-top: -50px;
          transition: all 0.25s ease, padding 0.25s ease 0s;
          opacity: 0;
          width: calc(100% - 20px);
          box-sizing: border-box;
          border-radius: 18px;
          border: 0px;
          cursor: pointer;
          background: transparent;
        }

        @media (max-width: 768px) {
          .dropdown-menu button span {
            font-size: 0.85rem !important;
          }
        }

        .dropdown-menu button:hover span,
        .dropdown-menu button.selected span {
          opacity: 1;
        }
        .dropdown-menu button:active {
          transform: scale(0.95);
        }
        .dropdown-menu button:active span {
          opacity: 0.5;
        }
        .dropdown-menu button span {
          margin-left: 15px;
          font-weight: bold;
          font-size: 0.9rem;
          transition: all 0.25s ease;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export { DropdownPeriod };
