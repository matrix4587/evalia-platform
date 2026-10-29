"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const countryCodes = [
  { code: "AF", dial: "+93", name: "Afghanistan" },
  { code: "AL", dial: "+355", name: "Albania" },
  { code: "DZ", dial: "+213", name: "Algeria" },
  { code: "AD", dial: "+376", name: "Andorra" },
  { code: "AO", dial: "+244", name: "Angola" },
  { code: "AG", dial: "+1-268", name: "Antigua and Barbuda" },
  { code: "AR", dial: "+54", name: "Argentina" },
  { code: "AM", dial: "+374", name: "Armenia" },
  { code: "AU", dial: "+61", name: "Australia" },
  { code: "AT", dial: "+43", name: "Austria" },
  { code: "AZ", dial: "+994", name: "Azerbaijan" },
  { code: "BS", dial: "+1-242", name: "Bahamas" },
  { code: "BH", dial: "+973", name: "Bahrain" },
  { code: "BD", dial: "+880", name: "Bangladesh" },
  { code: "BB", dial: "+1-246", name: "Barbados" },
  { code: "BY", dial: "+375", name: "Belarus" },
  { code: "BE", dial: "+32", name: "Belgium" },
  { code: "BZ", dial: "+501", name: "Belize" },
  { code: "BJ", dial: "+229", name: "Benin" },
  { code: "BT", dial: "+975", name: "Bhutan" },
  { code: "BO", dial: "+591", name: "Bolivia" },
  { code: "BA", dial: "+387", name: "Bosnia and Herzegovina" },
  { code: "BW", dial: "+267", name: "Botswana" },
  { code: "BR", dial: "+55", name: "Brazil" },
  { code: "BN", dial: "+673", name: "Brunei" },
  { code: "BG", dial: "+359", name: "Bulgaria" },
  { code: "BF", dial: "+226", name: "Burkina Faso" },
  { code: "BI", dial: "+257", name: "Burundi" },
  { code: "CV", dial: "+238", name: "Cabo Verde" },
  { code: "KH", dial: "+855", name: "Cambodia" },
  { code: "CM", dial: "+237", name: "Cameroon" },
  { code: "CA", dial: "+1", name: "Canada" },
  { code: "CF", dial: "+236", name: "Central African Republic" },
  { code: "TD", dial: "+235", name: "Chad" },
  { code: "CL", dial: "+56", name: "Chile" },
  { code: "CN", dial: "+86", name: "China" },
  { code: "CO", dial: "+57", name: "Colombia" },
  { code: "KM", dial: "+269", name: "Comoros" },
  { code: "CG", dial: "+242", name: "Congo" },
  { code: "CD", dial: "+243", name: "Congo (DRC)" },
  { code: "CR", dial: "+506", name: "Costa Rica" },
  { code: "CI", dial: "+225", name: "Côte d'Ivoire" },
  { code: "HR", dial: "+385", name: "Croatia" },
  { code: "CU", dial: "+53", name: "Cuba" },
  { code: "CY", dial: "+357", name: "Cyprus" },
  { code: "CZ", dial: "+420", name: "Czechia" },
  { code: "DK", dial: "+45", name: "Denmark" },
  { code: "DJ", dial: "+253", name: "Djibouti" },
  { code: "DM", dial: "+1-767", name: "Dominica" },
  { code: "DO", dial: "+1-809", name: "Dominican Republic" },
  { code: "EC", dial: "+593", name: "Ecuador" },
  { code: "EG", dial: "+20", name: "Egypt" },
  { code: "SV", dial: "+503", name: "El Salvador" },
  { code: "GQ", dial: "+240", name: "Equatorial Guinea" },
  { code: "ER", dial: "+291", name: "Eritrea" },
  { code: "EE", dial: "+372", name: "Estonia" },
  { code: "SZ", dial: "+268", name: "Eswatini" },
  { code: "ET", dial: "+251", name: "Ethiopia" },
  { code: "FJ", dial: "+679", name: "Fiji" },
  { code: "FI", dial: "+358", name: "Finland" },
  { code: "FR", dial: "+33", name: "France" },
  { code: "GA", dial: "+241", name: "Gabon" },
  { code: "GM", dial: "+220", name: "Gambia" },
  { code: "GE", dial: "+995", name: "Georgia" },
  { code: "DE", dial: "+49", name: "Germany" },
  { code: "GH", dial: "+233", name: "Ghana" },
  { code: "GR", dial: "+30", name: "Greece" },
  { code: "GD", dial: "+1-473", name: "Grenada" },
  { code: "GT", dial: "+502", name: "Guatemala" },
  { code: "GN", dial: "+224", name: "Guinea" },
  { code: "GW", dial: "+245", name: "Guinea-Bissau" },
  { code: "GY", dial: "+592", name: "Guyana" },
  { code: "HT", dial: "+509", name: "Haiti" },
  { code: "HN", dial: "+504", name: "Honduras" },
  { code: "HU", dial: "+36", name: "Hungary" },
  { code: "IS", dial: "+354", name: "Iceland" },
  { code: "IN", dial: "+91", name: "India" },
  { code: "ID", dial: "+62", name: "Indonesia" },
  { code: "IR", dial: "+98", name: "Iran" },
  { code: "IQ", dial: "+964", name: "Iraq" },
  { code: "IE", dial: "+353", name: "Ireland" },
  { code: "IL", dial: "+972", name: "Israel" },
  { code: "IT", dial: "+39", name: "Italy" },
  { code: "JM", dial: "+1-876", name: "Jamaica" },
  { code: "JP", dial: "+81", name: "Japan" },
  { code: "JO", dial: "+962", name: "Jordan" },
  { code: "KZ", dial: "+7", name: "Kazakhstan" },
  { code: "KE", dial: "+254", name: "Kenya" },
  { code: "KI", dial: "+686", name: "Kiribati" },
  { code: "KP", dial: "+850", name: "North Korea" },
  { code: "KR", dial: "+82", name: "South Korea" },
  { code: "KW", dial: "+965", name: "Kuwait" },
  { code: "KG", dial: "+996", name: "Kyrgyzstan" },
  { code: "LA", dial: "+856", name: "Laos" },
  { code: "LV", dial: "+371", name: "Latvia" },
  { code: "LB", dial: "+961", name: "Lebanon" },
  { code: "LS", dial: "+266", name: "Lesotho" },
  { code: "LR", dial: "+231", name: "Liberia" },
  { code: "LY", dial: "+218", name: "Libya" },
  { code: "LI", dial: "+423", name: "Liechtenstein" },
  { code: "LT", dial: "+370", name: "Lithuania" },
  { code: "LU", dial: "+352", name: "Luxembourg" },
  { code: "MG", dial: "+261", name: "Madagascar" },
  { code: "MW", dial: "+265", name: "Malawi" },
  { code: "MY", dial: "+60", name: "Malaysia" },
  { code: "MV", dial: "+960", name: "Maldives" },
  { code: "ML", dial: "+223", name: "Mali" },
  { code: "MT", dial: "+356", name: "Malta" },
  { code: "MH", dial: "+692", name: "Marshall Islands" },
  { code: "MR", dial: "+222", name: "Mauritania" },
  { code: "MU", dial: "+230", name: "Mauritius" },
  { code: "MX", dial: "+52", name: "Mexico" },
  { code: "FM", dial: "+691", name: "Micronesia" },
  { code: "MD", dial: "+373", name: "Moldova" },
  { code: "MC", dial: "+377", name: "Monaco" },
  { code: "MN", dial: "+976", name: "Mongolia" },
  { code: "ME", dial: "+382", name: "Montenegro" },
  { code: "MA", dial: "+212", name: "Morocco" },
  { code: "MZ", dial: "+258", name: "Mozambique" },
  { code: "MM", dial: "+95", name: "Myanmar" },
  { code: "NA", dial: "+264", name: "Namibia" },
  { code: "NR", dial: "+674", name: "Nauru" },
  { code: "NP", dial: "+977", name: "Nepal" },
  { code: "NL", dial: "+31", name: "Netherlands" },
  { code: "NZ", dial: "+64", name: "New Zealand" },
  { code: "NI", dial: "+505", name: "Nicaragua" },
  { code: "NE", dial: "+227", name: "Niger" },
  { code: "NG", dial: "+234", name: "Nigeria" },
  { code: "MK", dial: "+389", name: "North Macedonia" },
  { code: "NO", dial: "+47", name: "Norway" },
  { code: "OM", dial: "+968", name: "Oman" },
  { code: "PK", dial: "+92", name: "Pakistan" },
  { code: "PW", dial: "+680", name: "Palau" },
  { code: "PS", dial: "+970", name: "Palestine" },
  { code: "PA", dial: "+507", name: "Panama" },
  { code: "PG", dial: "+675", name: "Papua New Guinea" },
  { code: "PY", dial: "+595", name: "Paraguay" },
  { code: "PE", dial: "+51", name: "Peru" },
  { code: "PH", dial: "+63", name: "Philippines" },
  { code: "PL", dial: "+48", name: "Poland" },
  { code: "PT", dial: "+351", name: "Portugal" },
  { code: "QA", dial: "+974", name: "Qatar" },
  { code: "RO", dial: "+40", name: "Romania" },
  { code: "RU", dial: "+7", name: "Russia" },
  { code: "RW", dial: "+250", name: "Rwanda" },
  { code: "KN", dial: "+1-869", name: "Saint Kitts and Nevis" },
  { code: "LC", dial: "+1-758", name: "Saint Lucia" },
  { code: "VC", dial: "+1-784", name: "Saint Vincent and the Grenadines" },
  { code: "WS", dial: "+685", name: "Samoa" },
  { code: "SM", dial: "+378", name: "San Marino" },
  { code: "ST", dial: "+239", name: "Sao Tome and Principe" },
  { code: "SA", dial: "+966", name: "Saudi Arabia" },
  { code: "SN", dial: "+221", name: "Senegal" },
  { code: "RS", dial: "+381", name: "Serbia" },
  { code: "SC", dial: "+248", name: "Seychelles" },
  { code: "SL", dial: "+232", name: "Sierra Leone" },
  { code: "SG", dial: "+65", name: "Singapore" },
  { code: "SK", dial: "+421", name: "Slovakia" },
  { code: "SI", dial: "+386", name: "Slovenia" },
  { code: "SB", dial: "+677", name: "Solomon Islands" },
  { code: "SO", dial: "+252", name: "Somalia" },
  { code: "ZA", dial: "+27", name: "South Africa" },
  { code: "SS", dial: "+211", name: "South Sudan" },
  { code: "ES", dial: "+34", name: "Spain" },
  { code: "LK", dial: "+94", name: "Sri Lanka" },
  { code: "SD", dial: "+249", name: "Sudan" },
  { code: "SR", dial: "+597", name: "Suriname" },
  { code: "SE", dial: "+46", name: "Sweden" },
  { code: "CH", dial: "+41", name: "Switzerland" },
  { code: "SY", dial: "+963", name: "Syria" },
  { code: "TW", dial: "+886", name: "Taiwan" },
  { code: "TJ", dial: "+992", name: "Tajikistan" },
  { code: "TZ", dial: "+255", name: "Tanzania" },
  { code: "TH", dial: "+66", name: "Thailand" },
  { code: "TL", dial: "+670", name: "Timor-Leste" },
  { code: "TG", dial: "+228", name: "Togo" },
  { code: "TO", dial: "+676", name: "Tonga" },
  { code: "TT", dial: "+1-868", name: "Trinidad and Tobago" },
  { code: "TN", dial: "+216", name: "Tunisia" },
  { code: "TR", dial: "+90", name: "Turkey" },
  { code: "TM", dial: "+993", name: "Turkmenistan" },
  { code: "TV", dial: "+688", name: "Tuvalu" },
  { code: "UG", dial: "+256", name: "Uganda" },
  { code: "UA", dial: "+380", name: "Ukraine" },
  { code: "AE", dial: "+971", name: "United Arab Emirates" },
  { code: "GB", dial: "+44", name: "United Kingdom" },
  { code: "US", dial: "+1", name: "United States" },
  { code: "UY", dial: "+598", name: "Uruguay" },
  { code: "UZ", dial: "+998", name: "Uzbekistan" },
  { code: "VU", dial: "+678", name: "Vanuatu" },
  { code: "VA", dial: "+379", name: "Vatican City" },
  { code: "VE", dial: "+58", name: "Venezuela" },
  { code: "VN", dial: "+84", name: "Vietnam" },
  { code: "YE", dial: "+967", name: "Yemen" },
  { code: "ZM", dial: "+260", name: "Zambia" },
  { code: "ZW", dial: "+263", name: "Zimbabwe" },
];

// Mock Exchange Rate: 1 USD = 130 KES
const EXCHANGE_RATE = 130;

export function WithdrawalForm({ availableBalanceCents }: { availableBalanceCents: number }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  
  const [paymentDetail, setPaymentDetail] = useState(""); 
  const [countryCode, setCountryCode] = useState("+254"); 
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Calculate dynamic received amount
  const amountValue = parseFloat(amount) || 0;
  const isMpesa = method === "MPESA";
  const receivedAmount = isMpesa ? amountValue * EXCHANGE_RATE : amountValue;
  const currencySymbol = isMpesa ? "KES" : "USD";

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const finalPaymentDetail = isMpesa ? `${countryCode}${phoneNumber}` : paymentDetail;

    try {
      const response = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountValue,
          method: method,
          paymentDetail: finalPaymentDetail, 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success("Withdrawal request submitted successfully!");
      setAmount("");
      setMethod("");
      setPaymentDetail("");
      setPhoneNumber("");
      router.refresh(); 
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCountries = countryCodes.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.dial.includes(searchQuery)
  );

  const renderPaymentDetailField = () => {
    if (!method) return null;

    if (isMpesa) {
      return (
        <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="text-sm font-bold text-slate-900">
            Phone Number
          </label>
          <div className="flex items-center gap-2">
            <Select value={countryCode} onValueChange={setCountryCode}>
              <SelectTrigger className="w-[100px] h-10 bg-slate-50 text-sm font-bold px-3 shrink-0">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent className="z-[100] max-h-[300px]">
                <div className="sticky top-0 bg-white p-2 border-b border-slate-100 z-10">
                  <Input 
                    placeholder="Search country..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 text-sm"
                    onKeyDown={(e) => e.stopPropagation()} 
                  />
                </div>
                
                {filteredCountries.length === 0 ? (
                  <div className="p-2 text-center text-sm text-slate-500">No countries found.</div>
                ) : (
                  filteredCountries.map((c) => (
                    <SelectItem key={c.code} value={c.dial} className="font-semibold cursor-pointer">
                      {c.dial} {c.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Input 
              type="tel"
              placeholder="712 345 678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 h-10 bg-slate-50 text-base font-bold"
              required
            />
          </div>
        </div>
      );
    }

    let label = "";
    let placeholder = "";
    let type = "text";

    if (["WISE", "STRIPE", "PAYPAL"].includes(method)) {
      label = "Email Address";
      placeholder = "you@example.com";
      type = "email";
    } else if (method === "BANK_TRANSFER") {
      label = "Account Number";
      placeholder = "e.g. 1234567890";
    }

    return (
      <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
        <label className="text-sm font-bold text-slate-900">
          {label}
        </label>
        <Input 
          type={type}
          placeholder={placeholder}
          value={paymentDetail}
          onChange={(e) => setPaymentDetail(e.target.value)}
          className="h-10 bg-slate-50 text-base font-bold"
          required
        />
      </div>
    );
  };

  return (
    <Card className="w-full shadow-sm border-slate-200 !p-0">
      
      <div className="p-4 md:p-5 border-b border-slate-100">
        <CardTitle className="text-xl font-extrabold text-slate-900 mb-1">Request a Withdrawal</CardTitle>
        <CardDescription className="text-sm font-semibold text-slate-600">
          Enter the amount you wish to withdraw and select your preferred payment method.
        </CardDescription>
      </div>
      
      <div className="p-4 md:p-5">
        <form onSubmit={handleWithdraw} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-900">
                Amount (USD)
              </label>
              <Input 
                type="number" 
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={availableBalanceCents / 100}
                min="10"
                step="0.01"
                className="h-10 bg-slate-50 text-base font-bold"
                required
              />
              <p className="text-xs font-semibold text-slate-600">Max: ${(availableBalanceCents / 100).toFixed(2)}</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-900">
                Payment Method
              </label>
              <Select 
                value={method} 
                onValueChange={(val) => { 
                  setMethod(val); 
                  setPaymentDetail(""); 
                  setPhoneNumber("");
                  setSearchQuery(""); 
                }} 
                required
              >
                <SelectTrigger className="w-full h-10 bg-slate-50 text-base font-bold">
                  <SelectValue placeholder="Select a method" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  <SelectItem value="MPESA" className="font-bold">M-Pesa</SelectItem>
                  <SelectItem value="WISE" className="font-bold">Wise Transfer</SelectItem>
                  <SelectItem value="STRIPE" className="font-bold">Stripe</SelectItem>
                  <SelectItem value="BANK_TRANSFER" className="font-bold">Bank Transfer</SelectItem>
                  <SelectItem value="PAYPAL" className="font-bold">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {renderPaymentDetailField()}

          <div className="bg-slate-100/80 p-4 rounded-lg space-y-2 text-sm border border-slate-200 mt-2">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Requested Amount</span>
              <span>${amount ? amountValue.toFixed(2) : "0.00"}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Processing Fee</span>
              <span>$0.00</span>
            </div>
            
            {/* Dynamic Currency Display */}
            <div className="flex justify-between font-extrabold text-slate-900 pt-2 border-t border-slate-300 text-base">
              <span>You will receive</span>
              <span>
                {isMpesa && amount ? (
                  <span className="flex flex-col items-end">
                    <span>KES {receivedAmount.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Rate: 1 USD = {EXCHANGE_RATE} KES</span>
                  </span>
                ) : (
                  `$${amount ? amountValue.toFixed(2) : "0.00"}`
                )}
              </span>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 text-base font-extrabold shadow-sm bg-black text-white hover:bg-slate-800"
            disabled={
              isLoading || 
              availableBalanceCents < 1000 || 
              !amount || 
              amountValue < 10 || 
              !method || 
              (isMpesa ? !phoneNumber : !paymentDetail)
            }
          >
            {isLoading ? "Processing..." : "Submit Request"}
          </Button>
        </form>
      </div>
    </Card>
  );
}