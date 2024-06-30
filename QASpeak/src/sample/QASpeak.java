package sample;
//speakでIE出る。23:08 00:09 23:34
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
//speakBean
public class QASpeak extends HttpServlet {

	private String strHensin = "error";

	//課題　日付の自由設定
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
		RequestDispatcher rd = request.getRequestDispatcher("/speak.jsp");
		//response.sendRedirect("/Sample/pages/Contry.jsp");
		rd.forward(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		PrintWriter out;
		String str = "error";
		String outMsg = "";
		request.setCharacterEncoding("UTF-8");
		str = request.getParameter("sp_in");
		System.out.println(str);
		outMsg = hensin(str);
		CsvUtil csvutil = new CsvUtil();

		System.out.println("来てる");

		request.setAttribute("outMsg",outMsg);
		System.out.println(outMsg);

		RequestDispatcher rd = request.getRequestDispatcher("/speak.jsp");
		//response.sendRedirect("/Sample/pages/Contry.jsp");
		rd.forward(request, response);
	}

	private String hensin(String inStr) {
		String outStr = "error";
		if (inStr.equals("御社の事業に魅力")) {
			outStr = "◎";

		} else if (inStr.equals("こんにちわ")) {
			outStr = "こんにちわ";

		} else {
			outStr = "エラー";

		}
		return outStr;

	}
}
