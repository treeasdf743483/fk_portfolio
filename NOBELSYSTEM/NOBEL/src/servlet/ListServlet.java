package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import form.InputForm;

/**
 * Servlet implementation class ListServlet
 */
@WebServlet("/ListServlet")
public class ListServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ListServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);

		// TODO Auto-generated method stub
		response.setContentType("text/html;charset=UTF-8");
		request.setCharacterEncoding("UTF-8");
		doGet(request, response);
		String thema = "";
		String detail = "";
		String basis = "";



		InputForm nobelForm = new InputForm();
		//入力値を取得
		thema = (String) (request.getParameter("thema"));
		detail = (String) (request.getParameter("detail"));
		basis = (String) (request.getParameter("basis"));

		System.out.println("kiteru");
		HttpSession session = request.getSession();


		//�R�l�N�V����
		Connection conn = null;

		//�X�e�[�g�����g
		PreparedStatement ps = null;

		//���U���g�Z�b�g
		ResultSet rs = null;

		try {



			// 先程インストールしたMySQLのドライバを指定
			Class.forName("com.mysql.cj.jdbc.Driver");

			//Oracle�ɐڑ�
			conn = DriverManager.getConnection("jdbc:mysql://localhost/NOBELDB", "joilyd4023", "adlf102");
			StringBuffer sqlBuffer = new StringBuffer();
			sqlBuffer.append("insert into theory_T  values(?,?,?,?);");


			Statement stmt = conn.createStatement();

			String sql = "insert into theory_T  values(?,?,?,?,?);";
			ps = conn.prepareStatement(sql);

			ps.setInt(1, 0);
			ps.setString(2, thema);
			ps.setString(3, detail);
			ps.setString(4, basis);
			ps.setString(5, basis);

			int rel = ps.executeUpdate();

			//request.setAttribute("bean", arraylist);

			//Result���N���[�Y
			stmt.close();

			//Statement���N���[�Y


			InputForm inputForm = new InputForm();
			inputForm.setThema(thema);
			inputForm.setDetail(detail);
			inputForm.setBasis(basis);
			request.setAttribute("inputForm", inputForm);

			RequestDispatcher rd = request.getRequestDispatcher("/pages/display.jsp");
			//response.sendRedirect("/Sample/pages/Contry.jsp");
			rd.forward(request, response);
		} catch (Exception x) {
			x.printStackTrace();
			RequestDispatcher rd = request.getRequestDispatcher("/pages/display.jsp");
			//response.sendRedirect("/Sample/pages/Contry.jsp");
			rd.forward(request, response);

		} finally {
			try {
				if (rs != null) {
					//ResultSet���N���[�Y
					rs.close();
				}
				if (ps != null) {
					//Statement���N���[�Y
					ps.close();
				}
				//connection���N���[�Y
				conn.close();

			} catch (Exception e) {
				e.printStackTrace();
			}

		}
	}

}
