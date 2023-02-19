package servlet;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import form.InputForm;

/**
 * Servlet implementation class InputServlet
 */
@WebServlet("/InputServlet")
public class InputServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public InputServlet() {
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
		//System.out.println("kiteru");
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
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

		//System.out.println("kiteru");
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
			
			String sql = "insert into theory_T  values(?,?,?,?,?,?);";

			

			//実行するSQL文とパラメータを指定する
            ps = conn.prepareStatement(sql);
            ps.setInt(1, 100);
            ps.setString(2, thema);
            ps.setString(3, detail);
            ps.setString(4, basis);
            ps.setString(5, "");
            ps.setInt(6, 111);


			//String sql = "SELECT thema FROM theory_T";
			int num = ps.executeUpdate();

			//request.setAttribute("bean", arraylist);

			//Result���N���[�Y
			ps.close();



			csvOneWrite("nobel.csv",thema,basis,detail);

			

			InputForm inputForm = new InputForm();
			inputForm.setThema(thema);
			inputForm.setDetail(detail);
			inputForm.setBasis(basis);
			request.setAttribute("inputForm", inputForm);

			RequestDispatcher rd = request.getRequestDispatcher("/pages/display.jsp");
			
			rd.forward(request, response);
		} catch (Exception x) {
			x.printStackTrace();
			RequestDispatcher rd = request.getRequestDispatcher("/pages/display.jsp");
			
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

	//csvファイルの一行を書き込み(最終行に追加) 50文字で改行
	public static void csvOneWrite(String name,String theory,String basis,String detail) {
		try {
			File f = new File("C:\\保存\\workspace\\NOBEL\\WebContent\\pages\\nobel.csv");
			//パスは個別に設定する
			FileWriter f_out = new FileWriter("C:\\保存\\workspace\\NOBEL\\WebContent\\pages\\nobel.txt");
            //PrintWriter p = new PrintWriter(new BufferedWriter(f_out));

            PrintWriter p = new PrintWriter(new BufferedWriter
                    (new OutputStreamWriter(new FileOutputStream(f),"Shift-JIS")));

            FileInputStream input = new FileInputStream(f);
            InputStreamReader stream = new InputStreamReader(input,"SJIS");
            BufferedReader br = new BufferedReader(stream);
			String line;
			String[] data;
            String basisR = "";
            String detailR = "";



			int cnt = 0;
			// 1行ずつCSVファイルを読み込む

			p.println("テーマ：");
			p.println(theory);
			System.setProperty("line.separator","\n");

			//最後に゜だとエラー
            for(int i =0; i < basis.length();i++){
                basisR = basisR + basis.charAt(i);
                    if(basisR.charAt(i) == '。'){
                        basisR =  basisR + "\n";
                    }
            }

            for(int j =0; j < basis.length();j++){
                detailR = detailR + detail.charAt(j);
                    if(basisR.charAt(j) == '。'){
                        detailR =  detailR + "¥n";
                    }
            }


                    p.println("根拠:");
                    p.println(basisR);
                    p.println("");
                    p.println("");


                    p.println("詳細:");
                    p.println(detailR);
                    p.println("");
                    p.println("");


                    System.out.println("kiteru３");



				cnt++;
				p.close();



		} catch (IOException e) {
			System.out.println(e);

		}
	}

}
