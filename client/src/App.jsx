import { NextUIProvider } from "@nextui-org/react";
import * as React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import PrivateRoutes from "./middleware/PrivateRoute";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Dashboard from "./pages/dashboard/Dashboard";
import AddProperty from "./pages/property/AddProperty";
import EditProperty from "./pages/property/EditProperty";
import ListProperty from "./pages/property/ListProperty";
import AddUser from "./pages/user/AddUser";
import ChangePassword from "./pages/user/ChangePassword";
import EditUser from "./pages/user/EditUser";
import ListUser from "./pages/user/ListUser";
import Profile from "./pages/user/Profile";

import {
  BanquetManagement,
  CreateFoodPlans,
  ManageBookings,
  ManageConfigs,
  ManageFoodPlans,
  ManageHalls,
} from "./pages/banquet-management";
import CreateBillings from "./pages/billings/CreateBillings";
import ListPropertyBookings from "./pages/bookings/ListPropertyBookings";
import ManageBillings from "./pages/bookings/ManageBillings";
import ViewBooking from "./pages/bookings/ViewBooking";
import ListChannel from "./pages/channel/ListChannel";
import AddComplaints from "./pages/complaints/AddComplaints";
import ManageComplaints from "./pages/complaints/ManageComplaints";
import DamagedItemsManagement from "./pages/damages/DamagedItemsManagement";
import {
  EmployeeManagement,
  ManageDesignation,
} from "./pages/employee-management";
import Availability from "./pages/inventory/Availability";
import {
  CreateOrder,
  Inventory,
  KsrConfig,
  MenuConfig,
  RestrauntConfig,
  TaxConfig,
} from "./pages/ksr";
import KsrReports from "./pages/ksr/KsrReports";
import AddLostAndFoundItem from "./pages/lost-&-found/AddLostAndFoundItem";
import ManageLostAndFound from "./pages/lost-&-found/ManageLostAndFound";
import {
  AddSubCategories,
  AddVendor,
  CreateMarketItems,
  CreatePurchaseOrder,
  InHouseInventory,
  ManageMarketItems,
  ManagePurchaseOrder,
  MaterialCategories,
  MaterialManagement,
  VendorsManagement,
} from "./pages/material-management";
import { ConsumptionReportElectronics } from "./pages/material-management/electronics";
import ElectronicManagement from "./pages/material-management/electronics/ElectronicManagement";
import ConsumptionReportHouseKeeping from "./pages/material-management/house-keeping/ConsumptionReport";
import HouseKeepingManagement from "./pages/material-management/house-keeping/HouseKeepingManagement";
import {
  ConsumptionReportKitchen,
  KitchenManagement,
} from "./pages/material-management/kitchen";
import {
  CreateKitsAndComplementary,
  KitsAndComplementaryManagement,
} from "./pages/material-management/kits-&-complementary";
import {
  ConfigLaundry,
  LaundryManagement,
} from "./pages/material-management/laundry";
import NightAudit from "./pages/night-audit/NightAudit";
import AddBooking from "./pages/property/AddBooking";
import BookingsList from "./pages/property/ListPropertyBookings";
import AddRatePlan from "./pages/ratePlans/AddRatePlan";
import EditRatePlan from "./pages/ratePlans/EditRatePlan";
import ListRatePlans from "./pages/ratePlans/ListRatePlans";
import ManageReviews from "./pages/reviews/ManageReviews";
import AddRooms from "./pages/rooms/AddRooms";
import EditRooms from "./pages/rooms/EditRooms";
import ListRooms from "./pages/rooms/ListRooms";
import AddRoomTypes from "./pages/roomTypes/AddRoomTypes";
import EditRoomTypes from "./pages/roomTypes/EditRoomTypes";
import ListRoomTypes from "./pages/roomTypes/ListRoomTypes";
import Settings from "./pages/settings/Settings";

function App() {
  const navigate = useNavigate();
  return (
    <NextUIProvider navigate={navigate}>
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/register" exact element={<Register />} />
        <Route
          path="/reset-password/:token"
          exact
          element={<ResetPassword />}
        />
        <Route path="/forgot-password" exact element={<ForgotPassword />} />
        <Route path="/verify/:token" exact element={<VerifyEmail />} />
        <Route element={<PrivateRoutes />}>
          <Route
            path="/dashboard"
            exact
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/change-password"
            exact
            element={
              <MainLayout>
                <ChangePassword />
              </MainLayout>
            }
          />
          <Route
            path="/profile"
            exact
            element={
              <MainLayout>
                <Profile />
              </MainLayout>
            }
          />
          <Route
            path="/property"
            exact
            element={
              <MainLayout>
                <ListProperty />{" "}
              </MainLayout>
            }
          />
          <Route
            path="/property/add"
            exact
            element={
              <MainLayout>
                <AddProperty />
              </MainLayout>
            }
          />
          <Route
            path="/property/:id"
            exact
            element={
              <MainLayout>
                <EditProperty />
              </MainLayout>
            }
          />
          <Route
            path="/property/:propertyChannexId/bookings"
            exact
            element={
              <MainLayout>
                <BookingsList />
              </MainLayout>
            }
          />
          <Route
            path="/users"
            exact
            element={
              <MainLayout>
                <ListUser />
              </MainLayout>
            }
          />
          <Route
            path="/users/:id"
            exact
            element={
              <MainLayout>
                <EditUser />
              </MainLayout>
            }
          />
          <Route
            path="/user/create"
            exact
            element={
              <MainLayout>
                <AddUser />
              </MainLayout>
            }
          />
          <Route
            path="/room-types"
            exact
            element={
              <MainLayout>
                <ListRoomTypes />
              </MainLayout>
            }
          />
          <Route
            path="/room-types/create"
            exact
            element={
              <MainLayout>
                <AddRoomTypes />
              </MainLayout>
            }
          />
          <Route
            path="/room-types/:roomId"
            exact
            element={
              <MainLayout>
                <EditRoomTypes />
              </MainLayout>
            }
          />
          <Route
            path="/rate-plan/:roomId"
            exact
            element={
              <MainLayout>
                <ListRatePlans />
              </MainLayout>
            }
          />
          <Route
            path="/rate-plan/:roomId/create"
            exact
            element={
              <MainLayout>
                <AddRatePlan />
              </MainLayout>
            }
          />
          <Route
            path="/rate-plan/:roomId/edit/:ratePlanId"
            exact
            element={
              <MainLayout>
                <EditRatePlan />
              </MainLayout>
            }
          />

          <Route
            path="/room-types/:roomTypeId/rooms/"
            exact
            element={
              <MainLayout>
                <ListRooms />
              </MainLayout>
            }
          />
          <Route
            path="/room-types/:roomTypeId/rooms/create"
            exact
            element={
              <MainLayout>
                <AddRooms />
              </MainLayout>
            }
          />
          <Route
            path="/room-types/:roomTypeId/rooms/:roomId"
            exact
            element={
              <MainLayout>
                <EditRooms />
              </MainLayout>
            }
          />

          <Route
            path="/inventory"
            exact
            element={
              <MainLayout>
                <Availability />
              </MainLayout>
            }
          />

          <Route
            path="/channel"
            exact
            element={
              <MainLayout>
                <ListChannel />
              </MainLayout>
            }
          />
          <Route path="material-management">
            <Route
              index
              element={
                <MainLayout>
                  <MaterialManagement />
                </MainLayout>
              }
            />
            <Route path="purchase-order">
              <Route
                index
                element={
                  <MainLayout>
                    <ManagePurchaseOrder />
                  </MainLayout>
                }
              />
              <Route
                path="create"
                element={
                  <MainLayout>
                    <CreatePurchaseOrder />
                  </MainLayout>
                }
              />
            </Route>
            <Route
              path="inventory"
              element={
                <MainLayout>
                  <InHouseInventory />
                </MainLayout>
              }
            />
            <Route path="market-items">
              <Route
                index
                element={
                  <MainLayout>
                    <ManageMarketItems />
                  </MainLayout>
                }
              />
              <Route
                path="create"
                element={
                  <MainLayout>
                    <CreateMarketItems />
                  </MainLayout>
                }
              />
            </Route>
            <Route path="categories">
              <Route
                index
                element={
                  <MainLayout>
                    <MaterialCategories />
                  </MainLayout>
                }
              />
              <Route
                path="sub-categories/add"
                element={
                  <MainLayout>
                    <AddSubCategories />
                  </MainLayout>
                }
              />
            </Route>
            <Route path="vendors">
              <Route
                index
                element={
                  <MainLayout>
                    <VendorsManagement />
                  </MainLayout>
                }
              />
              <Route path="add">
                <Route
                  index
                  element={
                    <MainLayout>
                      <AddVendor />
                    </MainLayout>
                  }
                />
              </Route>
              {/* <Route path="edit" element={<EditVendor />} /> */}
              {/* <Route path="details">
                <Route path=":id" element={<VendorDetails />} />
              </Route> */}
            </Route>
            <Route path="kitchen">
              <Route
                index
                element={
                  <MainLayout>
                    <KitchenManagement />
                  </MainLayout>
                }
              />
              <Route
                path="consumption-report"
                element={
                  <MainLayout>
                    <ConsumptionReportKitchen />
                  </MainLayout>
                }
              />
            </Route>
            <Route path="laundry">
              <Route
                index
                element={
                  <MainLayout>
                    <LaundryManagement />
                  </MainLayout>
                }
              />
              {/* <Route path="add" element={<AddLaundryManagement />} /> */}
              <Route
                path="config"
                element={
                  <MainLayout>
                    <ConfigLaundry />
                  </MainLayout>
                }
              />
            </Route>
            <Route path="house-keeping">
              <Route
                index
                element={
                  <MainLayout>
                    <HouseKeepingManagement />
                  </MainLayout>
                }
              />

              <Route
                path="consumption-report"
                element={
                  <MainLayout>
                    <ConsumptionReportHouseKeeping />
                  </MainLayout>
                }
              />
            </Route>
            <Route path="electronics">
              <Route
                index
                element={
                  <MainLayout>
                    <ElectronicManagement />
                  </MainLayout>
                }
              />
              <Route
                path="consumption-report"
                element={
                  <MainLayout>
                    <ConsumptionReportElectronics />
                  </MainLayout>
                }
              />
            </Route>
            <Route path="kits-&-complementary">
              <Route
                index
                element={
                  <MainLayout>
                    <KitsAndComplementaryManagement />
                  </MainLayout>
                }
              />
              <Route
                path="create"
                element={
                  <MainLayout>
                    <CreateKitsAndComplementary />
                  </MainLayout>
                }
              />
            </Route>
          </Route>
          <Route path="ksr">
            <Route path="config">
              <Route
                index
                element={
                  <MainLayout>
                    <KsrConfig />
                  </MainLayout>
                }
              />
              <Route
                path="restaurant"
                element={
                  <MainLayout>
                    <RestrauntConfig />
                  </MainLayout>
                }
              />
              <Route
                path="menu"
                element={
                  <MainLayout>
                    <MenuConfig />
                  </MainLayout>
                }
              />
              <Route
                path="tax"
                element={
                  <MainLayout>
                    <TaxConfig />
                  </MainLayout>
                }
              />
            </Route>
            <Route
              path="inventory"
              element={
                <MainLayout>
                  <Inventory />
                </MainLayout>
              }
            />
            <Route
              path="reports"
              element={
                <MainLayout>
                  <KsrReports />
                </MainLayout>
              }
            />
            <Route
              path="create-order"
              element={
                <MainLayout>
                  <CreateOrder />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="damages"
            element={
              <MainLayout>
                <DamagedItemsManagement />
              </MainLayout>
            }
          />
          <Route path="employee">
            <Route
              path="manage"
              element={
                <MainLayout>
                  <EmployeeManagement />
                </MainLayout>
              }
            />
            <Route
              path="designation"
              element={
                <MainLayout>
                  <ManageDesignation />
                </MainLayout>
              }
            />
          </Route>
          <Route path="banquet">
            <Route
              index
              element={
                <MainLayout>
                  <BanquetManagement />
                </MainLayout>
              }
            />
            <Route
              path="bookings"
              element={
                <MainLayout>
                  <ManageBookings />
                </MainLayout>
              }
            />
            <Route path="manage">
              <Route
                path="configs"
                element={
                  <MainLayout>
                    <ManageConfigs />
                  </MainLayout>
                }
              />
              <Route
                path="halls"
                element={
                  <MainLayout>
                    <ManageHalls />
                  </MainLayout>
                }
              />
              <Route path="food-plans">
                <Route
                  index
                  element={
                    <MainLayout>
                      <ManageFoodPlans />
                    </MainLayout>
                  }
                />
                <Route
                  path="create"
                  element={
                    <MainLayout>
                      <CreateFoodPlans />
                    </MainLayout>
                  }
                />
              </Route>
              {/* <Route path="decoration-plans">
              <Route index element={<ManageDecorationPlans />} />
              <Route path="create" element={<CreateDecorationPlans />} />
            </Route> */}
            </Route>
          </Route>
          <Route path="complaints">
            <Route
              index
              element={
                <MainLayout>
                  <ManageComplaints />
                </MainLayout>
              }
            />
            <Route
              path="add"
              element={
                <MainLayout>
                  <AddComplaints />
                </MainLayout>
              }
            />
          </Route>
          <Route path="lost-and-found">
            <Route
              index
              element={
                <MainLayout>
                  <ManageLostAndFound />
                </MainLayout>
              }
            />
            <Route
              path="add"
              element={
                <MainLayout>
                  <AddLostAndFoundItem />
                </MainLayout>
              }
            />
          </Route>
          {/* <Route path="reviews">
            <Route index element={<ManageReviews />} />
          </Route> */}
          {/* <Route path="billings">
            <Route
              index
              element={
                <MainLayout>
                  <ManageBillings />
                </MainLayout>
              }
            />
            <Route
              path="add"
              element={
                <MainLayout>
                  <CreateBillings />
                </MainLayout>
              }
            />
          </Route> */}
          <Route
            path="/bookings/create"
            exact
            element={<MainLayout children={<AddBooking />} />}
          />
          <Route
            path="/bookings"
            exact
            element={<MainLayout children={<ListPropertyBookings />} />}
          />
          <Route
            path="/bookings/:bookingId"
            exact
            element={<MainLayout children={<ViewBooking />} />}
          />
          <Route
            path="/bookings/:bookingId/billings"
            exact
            element={<MainLayout children={<ManageBillings />} />}
          />
          <Route
            path="night-audit"
            element={<MainLayout children={<NightAudit />} />}
          />
          <Route
            path="settings"
            element={<MainLayout children={<Settings />} />}
          />
        </Route>
      </Routes>
    </NextUIProvider>
  );
}

export default App;
