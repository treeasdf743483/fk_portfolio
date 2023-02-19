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
 * Servlet implementation class ListAll
 */
@WebServlet("/ListAll")
public class ListAll extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ListAll() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub


		response.setContentType("text/html; charset=UTF-8");
		request.setCharacterEncoding("UTF-8");
		doPost(request,response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub


		// TODO Auto-generated method stub
		response.setContentType("text/html; charset=UTF-8");
		request.setCharacterEncoding("UTF-8");

		String[] thema = new String[7000];
		String detail = "";
		String basis = "";
		int i = 0;



		InputForm nobelForm = new InputForm();
		//入力値を取得
		detail = (String) (request.getParameter("detail"));
		basis = (String) (request.getParameter("basis"));


		HttpSession session = request.getSession();
		//session.setAttribute("Bean", loginBean);

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
			sqlBuffer.append("select thema from theory_T;");


			Statement stmt = conn.createStatement();

			String sql = "select thema from theory_T;";
			rs = stmt.executeQuery(sql);

			while (rs.next()) {
				thema[i] = rs.getString("thema");
				i++;
			}

			//request.setAttribute("bean", arraylist);

			rs.close();
			//Result���N���[�Y
			stmt.close();

			//Statement���N���[�Y
			//ps.close();

			request.setAttribute("themaArr", thema);
			request.setAttribute("cnt", i + 1);

			RequestDispatcher rd = request.getRequestDispatcher("/pages/list.jsp");

			rd.forward(request, response);
		} catch (Exception x) {
			x.printStackTrace();
			RequestDispatcher rd = request.getRequestDispatcher("/pages/nobel.jsp");

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
